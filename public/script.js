const form = document.getElementById("uploadForm");
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const responseMessage = document.getElementById("responseMessage");
const results = document.getElementById("results");
const loadingSpinner = document.getElementById("loadingSpinner");
const placeholderMessage = document.getElementById("placeholderMessage");
const outputContent = document.getElementById("outputContent");
const originalText = document.getElementById("originalText");
const summaryText = document.getElementById("summaryText");
const keyPointsList = document.getElementById("keyPointsList");
const fileName = document.getElementById("fileName");
const filePreview = document.getElementById("filePreview");
const pdfPreviewText = document.getElementById("pdfPreviewText");
const previewContainer = document.getElementById("previewContainer");
const summaryLength = document.getElementById("summary_length");

// Add iframe for PDF preview
const pdfPreview = document.createElement("iframe");
pdfPreview.style.width = "100%";
pdfPreview.style.height = "300px";
pdfPreview.style.border = "1px solid #ccc";
pdfPreview.style.borderRadius = "10px";
pdfPreview.classList.add("d-none");
previewContainer.appendChild(pdfPreview);

// Update file name and preview
const updatePreview = (file) => {
  if (!file) return;

  previewContainer.classList.remove("d-none");
  fileName.textContent = `Selected File: ${file.name}`;
  const fileType = file.type;

  if (fileType.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      filePreview.src = e.target.result;
      filePreview.classList.remove("d-none");
      pdfPreview.classList.add("d-none");
      pdfPreviewText.classList.add("d-none");
    };
    reader.readAsDataURL(file);
  } else if (fileType === "application/pdf") {
    const fileURL = URL.createObjectURL(file);
    pdfPreview.src = fileURL;
    pdfPreview.classList.remove("d-none");
    filePreview.classList.add("d-none");
    pdfPreviewText.classList.add("d-none");
  } else {
    filePreview.classList.add("d-none");
    pdfPreview.classList.add("d-none");
    pdfPreviewText.textContent = "Unsupported file type.";
    pdfPreviewText.classList.remove("d-none");
  }
};

dropZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropZone.classList.add("dragging");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragging");
});

dropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  dropZone.classList.remove("dragging");
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    fileInput.files = files;
    updatePreview(files[0]);
  }
});

dropZone.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  updatePreview(file);
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = fileInput.files[0];
  if (!file) {
    responseMessage.innerHTML = `<div class="alert alert-warning">Please select a file.</div>`;
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("length", summaryLength.value);

  placeholderMessage.classList.add("d-none");
  outputContent.classList.add("d-none");
  loadingSpinner.style.display = "block";

  try {
    const response = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });

    loadingSpinner.style.display = "none";

    if (response.ok) {
      const data = await response.json();
      originalText.textContent = data.text || "No text extracted.";
      summaryText.textContent = data.summary || "No summary generated.";
      keyPointsList.innerHTML = "";

      (data.key_points || []).forEach((point) => {
        const li = document.createElement("li");
        li.textContent = point;
        keyPointsList.appendChild(li);
      });

      outputContent.classList.remove("d-none");
      responseMessage.innerHTML = `<div class="alert alert-success">File processed successfully!</div>`;
    } else {
      responseMessage.innerHTML = `<div class="alert alert-danger">Error processing file.</div>`;
    }
  } catch (error) {
    loadingSpinner.style.display = "none";
    responseMessage.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
  }
});
