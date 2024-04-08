document.addEventListener('DOMContentLoaded', () => {
  const albums = [
    {
      name: 'Easter Weekend',
      photos: [
        'images/photos/easter-weekend.jpg',
        'images/photos/easter-weekend1.jpg',
        'images/photos/easter-weekend2.jpg',
        'images/photos/easter-weekend3.jpg',
        'images/photos/easter-weekend4.jpg',
        'images/photos/easter-weekend5.jpg',
      ],
    },
    {
      name: 'Marriage and Honeymoon',
      photos: [
        'images/photos/wedding-honeymoon/myfamily.jpg',
        'images/photos/wedding-honeymoon/wedding0.jpg',
        'images/photos/wedding-honeymoon/wedding2.jpg',
        'images/photos/wedding-honeymoon/wedding3.jpg',
        'images/photos/wedding-honeymoon/wedding4.jpg',
        'images/photos/wedding-honeymoon/honeymoon1.jpg',
        'images/photos/wedding-honeymoon/honeymoon2.jpg',
        'images/photos/wedding-honeymoon/honeymoon3.jpg',
        'images/photos/wedding-honeymoon/honeymoon4.jpg',
        'images/photos/wedding-honeymoon/honeymoon5.jpg',
        'images/photos/wedding-honeymoon/honeymoon6.jpg',
        'images/photos/wedding-honeymoon/honeymoon7.jpg',
        'images/photos/wedding-honeymoon/honeymoon8.jpg',
        'images/photos/wedding-honeymoon/honeymoon9.jpg',
        'images/photos/wedding-honeymoon/honeymoon10.jpg',
        'images/photos/wedding-honeymoon/honeymoon11.jpg',
        'images/photos/wedding-honeymoon/honeymoon12.jpg',
        'images/photos/wedding-honeymoon/honeymoon13.jpg',
        'images/photos/wedding-honeymoon/honeymoon14.jpg',
        'images/photos/wedding-honeymoon/honeymoon15.jpg',
        'images/photos/wedding-honeymoon/honeymoon16.jpg',
        'images/photos/wedding-honeymoon/honeymoon17.jpg',

        // More photos...
      ],
    },
    // Add more albums as needed...
  ];

  function displayAlbum(albumIndex) {
    const selectedAlbum = albums[albumIndex];
    const albumContainer = document.getElementById(`album-container-${albumIndex + 1}`);
    albumContainer.innerHTML = ''; // Clear existing thumbnails if any

    // Limit displaying up to the first 5 thumbnails
    const displayLimit = Math.min(5, selectedAlbum.photos.length);
    for (let index = 0; index < displayLimit; index++) {
      const photoUrl = selectedAlbum.photos[index];
      const thumbDiv = document.createElement('div');
      thumbDiv.className = 'thumbnail';
      thumbDiv.innerHTML = `<img src="${photoUrl}" alt="Photo ${index + 1}">`;
      thumbDiv.onclick = () => {
        currentAlbumIndex = albumIndex; // Update global album index
        showFullPhoto(albumIndex, index);
      };
      albumContainer.appendChild(thumbDiv);
    }

    // If there are more than 5 photos, add a "View More" option
    if (selectedAlbum.photos.length > 5) {
      const viewMoreDiv = document.createElement('div');
      viewMoreDiv.className = 'view-more';
      viewMoreDiv.innerText = 'View More...';
      viewMoreDiv.onclick = () => {
        currentAlbumIndex = albumIndex; // Update global album index
        showFullPhoto(albumIndex, 0); // Open the modal starting with the first photo
      };
      albumContainer.appendChild(viewMoreDiv);
    }
  }

  function showFullPhoto(albumIndex, photoIndex) {
    const modal = document.getElementById('photoModal');
    const fullPhoto = document.getElementById('fullPhoto');
    const selectedAlbum = albums[albumIndex];
    fullPhoto.src = selectedAlbum.photos[photoIndex];


      // Function to show the next photo
  function showNextPhoto() {
    const selectedAlbum = albums[currentAlbumIndex];
    currentPhotoIndex = (currentPhotoIndex + 1) % selectedAlbum.photos.length;
    showFullPhoto(currentAlbumIndex, currentPhotoIndex);
  }

  // Function to show the previous photo
  function showPreviousPhoto() {
    const selectedAlbum = albums[currentAlbumIndex];
    currentPhotoIndex = (currentPhotoIndex - 1 + selectedAlbum.photos.length) % selectedAlbum.photos.length;
    showFullPhoto(currentAlbumIndex, currentPhotoIndex);
  }
    
    // Update arrows for navigation
    document.getElementById('prevArrow').onclick = () => {
      const newIndex = (photoIndex - 1 + selectedAlbum.photos.length) % selectedAlbum.photos.length;
      showFullPhoto(albumIndex, newIndex);
    };
    document.getElementById('nextArrow').onclick = () => {
      const newIndex = (photoIndex + 1) % selectedAlbum.photos.length;
      showFullPhoto(albumIndex, newIndex);
    };

      // Listen for keydown events for left and right arrow keys
  document.addEventListener('keydown', (event) => {
    if (event.key === "ArrowLeft") {
      showPreviousPhoto();
    } else if (event.key === "ArrowRight") {
      showNextPhoto();
    }
  });

    modal.classList.add('active');
  }

  

    // Close modal when the close button is clicked
  document.getElementById('closeModal').onclick = () => {
    document.getElementById('photoModal').classList.remove('active');
  };

  // Close modal when clicking outside of the modal content
  document.getElementById('photoModal').addEventListener('click', (event) => {
    if (event.target === event.currentTarget) {
      event.currentTarget.classList.remove('active');
    }
  });

  // Close modal when pressing the Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === "Escape") {
      const modal = document.getElementById('photoModal');
      if (modal.classList.contains('active')) {
        modal.classList.remove('active');
      }
    }
  });

  document.getElementById('zoomIn').onclick = () => {
    document.getElementById('fullPhoto').classList.add('zoomed-in');
  };

  document.getElementById('zoomOut').onclick = () => {
    document.getElementById('fullPhoto').classList.remove('zoomed-in');
  };

  
  // Display all albums
  albums.forEach((_, index) => {
    displayAlbum(index);
  });
});
