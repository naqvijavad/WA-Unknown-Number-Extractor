chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "storeNumbers") {
      chrome.storage.local.get({ numbers: [] }, (result) => {
        const updatedNumbers = Array.from(new Set([...result.numbers, ...request.numbers]));
        chrome.storage.local.set({ numbers: updatedNumbers }, () => {
          // Send message to all connected popups to update their lists
          chrome.runtime.sendMessage({ action: "numbersUpdated" });
        });          
      });
      return true; // Keep the message channel open for sendResponse
    } else if (request.action === "getNumbers") {
      chrome.storage.local.get({ numbers: [] }, (result) => {
        sendResponse({ numbers: result.numbers });
      });
      return true; // Keep the message channel open for sendResponse
    } else if (request.action === "clearNumbers") {
      chrome.storage.local.set({ numbers: [] }, () => {
        sendResponse({ status: "success" });
        // Send message to all connected popups to update their lists after clearing
        chrome.runtime.sendMessage({ action: "numbersUpdated" });
      });
      return true; // Keep the message channel open for sendResponse
    }
  });
  