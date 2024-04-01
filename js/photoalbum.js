const photoAlbum = [
    '../images/photos/easter-weekend.jpg',
    '../images/photos/easter-weekend1.jpg',
    '../images/photos/easter-weekend2.jpg',
    '../images/photos/easter-weekend3.jpg',
    '../images/photos/easter-weekend4.jpg',
    // ... more photos
  ];
  
  let currentPhotoIndex = 0; // To keep track of the current photo

  // Reference to the album container
  const albumContainer = document.querySelector('.album-container');

photoAlbum.forEach((photoUrl, index) => {
  const thumbDiv = document.createElement('div');
  thumbDiv.className = 'thumbnail';
  thumbDiv.innerHTML = `<img src="${photoUrl}" alt="Photo ${index + 1}">`;
  thumbDiv.onclick = () => {
    showFullPhoto(index);
  };
  albumContainer.appendChild(thumbDiv);
});

function showFullPhoto(index) {
  const modal = document.getElementById('photoModal');
  const fullPhoto = document.getElementById('fullPhoto');
  currentPhotoIndex = index;
  fullPhoto.src = photoAlbum[index];
  modal.classList.add('active');
}

const modal = document.getElementById('photoModal');
document.getElementById('closeModal').onclick = () => {
  modal.classList.remove('active');
};

modal.onclick = (event) => {
  if (event.target === modal) {
    modal.classList.remove('active');
  }
};

document.getElementById('prevArrow').onclick = () => {
  if (currentPhotoIndex > 0) {
    showFullPhoto(currentPhotoIndex - 1);
  } else {
    showFullPhoto(photoAlbum.length - 1); // Loop back to the last photo
  }
};

document.getElementById('nextArrow').onclick = () => {
  if (currentPhotoIndex < photoAlbum.length - 1) {
    showFullPhoto(currentPhotoIndex + 1);
  } else {
    showFullPhoto(0); // Loop back to the first photo
  }
};
// Zoom control
document.getElementById('zoomIn').onclick = () => {
  document.getElementById('fullPhoto').classList.add('zoomed-in');
  document.getElementById('fullPhoto').classList.remove('zoomed-out');
};

document.getElementById('zoomOut').onclick = () => {
  document.getElementById('fullPhoto').classList.add('zoomed-out');
  document.getElementById('fullPhoto').classList.remove('zoomed-in');
}