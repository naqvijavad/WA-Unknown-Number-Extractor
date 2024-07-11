let contactsSet = new Set();

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    const newContacts = mutation.addedNodes;
    if (newContacts.length > 0) {
      const newNumbers = [];
      document.querySelectorAll('span[title]').forEach((element) => {
        const title = element.getAttribute('title');
        if (title && title.match(/^\+\d+/)) {
          newNumbers.push(title);
        }
      });

      newNumbers.forEach(number => contactsSet.add(number));

      const uniqueContacts = Array.from(contactsSet);

      // Send the unique numbers to the background script for storage immediately
      chrome.runtime.sendMessage({ action: "storeNumbers", numbers: uniqueContacts }, (response) => {
        if (response.status === "success") {
          console.log("Numbers stored successfully");
        }
      });
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
