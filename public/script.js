// script.js

document.addEventListener("DOMContentLoaded", function () {
  const textInput = document.getElementById("textInput");
  const downloadButton = document.getElementById("downloadButton");
  const filenameInput = document.getElementById("filenameInput");
  const hiddenText = document.getElementById("hiddenText");
  const wordCountElement = document.getElementById("wordCount");

  let totalWordCount = 0;  // Persistent word count
  let paragraphs = [];  // DOCX paragraphs

  // Helper function to update word count based on text added to hiddenText
  function updateWordCount(text) {
      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      totalWordCount += words.length;
      wordCountElement.textContent = totalWordCount;
  }

  // Event listener for ". " trigger
  textInput.addEventListener("input", function () {
      const value = textInput.value;

      // Check if the last two characters are ". "
      if (value.endsWith(". ") || value.endsWith('! ') || value.endsWith('? ')) {
          // Add the current text to the hidden element and clear the textarea
          hiddenText.innerText += value.trim() + " ";
          textInput.value = "";  // Clear the textarea

          // Update the word count
          updateWordCount(value.trim());
      }
  });

  textInput.addEventListener('click', (event) => {
    // $(document.body.style.background) = "#98b7ba"
    $('body').addClass('backgroundShift')
  })

  // Event listener for detecting "Enter" key
  textInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
          e.preventDefault();  // Prevent default behavior of "Enter"

          // Add the current textarea text to the hidden element
          if (textInput.value.trim() !== "") {
              hiddenText.innerText += textInput.value.trim() + " " + '\n';
              textInput.value = "";  // Clear the textarea

              // Update the word count for the added text
              updateWordCount(hiddenText.innerText);
          }

          // Add the hidden element text as a new paragraph in the DOCX
          if (hiddenText.innerText.trim() !== "") {
              paragraphs.push(new docx.Paragraph({
                  text: hiddenText.innerText.trim(),
                  alignment: docx.AlignmentType.LEFT,
              }));
          }

          // Clear the hidden element after adding to the DOCX
          hiddenText.innerText = "";
      }
  });

  // Event listener for the download button
  downloadButton.addEventListener("click", function () {
      const filename = filenameInput.value.trim() || "document";  // Default filename
      hiddenText.innerText += textInput.value.trim() + " " + '\n';
      if (hiddenText.innerText.trim() !== "") {
        paragraphs.push(new docx.Paragraph({
            text: hiddenText.innerText.trim(),
            alignment: docx.AlignmentType.LEFT,
        }));
      }

      hiddenText.innerText = "";
      // Create the docx document with the collected paragraphs
      const doc = new docx.Document({
          sections: [
              {
                  properties: {},
                  children: paragraphs,
              },
          ],
      });

      // Generate and download the docx file
      docx.Packer.toBlob(doc).then((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${filename}.docx`;
          link.click();
          URL.revokeObjectURL(url);  // Clean up the object URL after download
      });
  });
});

