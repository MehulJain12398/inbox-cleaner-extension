type EmailItem = {
    id: string;
    subject: string;
    sender: string;
    date: string;
    type: "Promotions" | "Old" | "Spam-like"; // You can tweak categories
  };


export async function fetchEmailMetadata(token: string, ids: string[]): Promise<EmailItem[]> {
    const emails: EmailItem[] = [];
  
    for (const id of ids) {
      const res = await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
  
      const headers = data.payload.headers;
      const getHeader = (name: string) =>
        headers.find((h: any) => h.name === name)?.value || "";
  
      const subject = getHeader("Subject");
      const sender = getHeader("From");
      const dateStr = getHeader("Date");
      const date = new Date(dateStr);
      const now = new Date();
  
      // 🧠 Heuristic logic
      let type: EmailItem["type"] = "Old";
      const lowerSubj = subject.toLowerCase();
      const lowerSender = sender.toLowerCase();
  
      const isPromotional =
        /deal|sale|offer|promo|discount|free|newsletter|subscribe/.test(lowerSubj) ||
        /mailchimp|hubspot|shopify|marketing|noreply|notification/.test(lowerSender);
  
      const isSpam =
        /win|lottery|urgent|claim|bitcoin|investment/.test(lowerSubj) ||
        /unknown|random|spammer/.test(lowerSender);
  
      const isOld = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24) > 60;
  
      if (isPromotional) type = "Promotions";
      else if (isSpam) type = "Spam-like";
      else if (isOld) type = "Old";
  
      emails.push({
        id,
        subject,
        sender,
        date: date.toDateString(),
        type,
      });
    }
  
    return emails;
  }
  