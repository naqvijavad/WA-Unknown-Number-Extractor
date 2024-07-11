document.addEventListener('DOMContentLoaded', () => {
    const numberList = document.getElementById('numberList');
    const clearButton = document.getElementById('clearButton');
    const copyButton = document.getElementById('copyButton');
  
    // Function to update the displayed numbers
    function updateNumberList() {
      // Clear existing list
      numberList.innerHTML = '';
  
      // Fetch stored numbers from the background script
      chrome.runtime.sendMessage({ action: "getNumbers" }, (response) => {
        response.numbers.forEach((number) => {
          const li = document.createElement('li');
          li.textContent = number;
          numberList.appendChild(li);
        });
      });
    }
  
    // Initial update when popup is opened
    updateNumberList();
  
    // Listen for changes in the background script and update the list
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "numbersUpdated") {
        updateNumberList();
      }
    });
  
    // Handle click on clear button
    clearButton.addEventListener('click', () => {
      // Send message to background script to clear numbers
      chrome.runtime.sendMessage({ action: "clearNumbers" }, () => {
        // Update the displayed list after clearing
        updateNumberList();
      });
    });
  
    // Handle click on copy button
    copyButton.addEventListener('click', () => {
      // Fetch stored numbers from the background script
      chrome.runtime.sendMessage({ action: "getNumbers" }, (response) => {
        const numbers = response.numbers.join('\n');
        // Copy numbers to clipboard
        navigator.clipboard.writeText(numbers).then(() => {
          console.log('Numbers copied to clipboard:', numbers);
        }).catch((error) => {
          console.error('Error copying numbers to clipboard:', error);
        });
      });
    });
  });
  