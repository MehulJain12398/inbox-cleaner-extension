chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "LOGIN_WITH_GOOGLE") {
      chrome.identity.getAuthToken({ interactive: true }, (cachedToken) => {
        if (chrome.runtime.lastError) {
          sendResponse({ error: chrome.runtime.lastError.message });
          return;
        }
  
        // Remove and force new token with proper scopes
        chrome.identity.removeCachedAuthToken({ token: cachedToken }, () => {
          chrome.identity.getAuthToken({ interactive: true }, (newToken) => {
            if (chrome.runtime.lastError) {
              sendResponse({ error: chrome.runtime.lastError.message });
            } else {
              sendResponse({ token: newToken });
            }
          });
        });
      });
  
      return true; // async response
    }
  });
  