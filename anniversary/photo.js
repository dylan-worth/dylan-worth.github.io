const photos = [
    { url: 'img/year1.jpg', caption: 'Where it all began' },
    { url: 'img/year2.jpg', caption: 'The early days' },
    { url: 'img/year3.jpg', caption: 'Disney adventures' },
    { url: 'img/year4.jpg', caption: 'Building our life' },
    { url: 'img/year5.jpg', caption: 'Half a decade down' },
    { url: 'img/year6.jpg', caption: 'Growing together' },
    { url: 'img/year7.jpg', caption: 'More magic' },
    { url: 'img/year8.jpg', caption: 'Strength and love' },
    { url: 'img/year9.jpg', caption: 'Almost there' },
    { url: 'img/year10.jpg', caption: 'The Big Ten' }
];

const grid = document.getElementById('photo-grid');

photos.forEach(photo => {
    const div = document.createElement('div');
    div.className = 'photo-item';
    div.innerHTML = `<img src="${photo.url}" alt="${photo.caption}" title="${photo.caption}">`;
    grid.appendChild(div);
});