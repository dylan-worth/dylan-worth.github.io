import os
from datetime import datetime
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import emoji

# Directory where images are stored
image_dir = 'images/albums/'

def create_post(date, content, image_folder, post_id):
    images = [img for img in os.listdir(os.path.join(image_dir, image_folder)) if img.endswith('.jpg') or img.endswith('.png')]

    post_html = f"""
    <div class="post-section">
        <div class="post-header">
            <img src="images/profile/pfp.jpg" alt="Profile" class="post-avatar">
            <div class="post-info">
                <span class="post-date">{date}</span>
                <span class="post-type">Post</span>
            </div>
        </div>
        <p>{content}</p>
        <div class="album-container" id="album-container-{post_id}">
    """
    
    for img in images:
        post_html += f'<img src="{image_dir}{image_folder}/{img}" class="thumbnail" alt="Thumbnail" onclick="showFullPhoto({post_id}, \'{img}\')">\n'

    post_html += """
        </div>
    </div>
    <!-- Modal for viewing full photo - You can use one modal for all albums, just update its content dynamically -->
    <div class="modal" id="photoModal">
        <span class="close" id="closeModal">&times;</span>
        <span class="arrow left" id="prevArrow">&#10094;</span>
        <span class="arrow right" id="nextArrow">&#10095;</span>
        <img class="full-photo" id="fullPhoto" src="" alt="">
        <button class="zoom-control" id="zoomIn">+</button>
        <button class="zoom-control" id="zoomOut">-</button>
    </div>
    """
    
    return post_html

class PostApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Post Creator")

        # Apply Dracula theme
        self.apply_dracula_theme()

        self.date_label = ttk.Label(root, text="Date:")
        self.date_label.grid(row=0, column=0, padx=5, pady=5)
        self.date_entry = ttk.Entry(root)
        self.date_entry.grid(row=0, column=1, padx=5, pady=5)
        self.date_entry.insert(0, datetime.now().strftime("%B %d, %Y"))

        self.content_label = ttk.Label(root, text="Content:")
        self.content_label.grid(row=1, column=0, padx=5, pady=5)
        self.content_entry = tk.Text(root, height=10, width=40, bg="#44475a", fg="#f8f8f2", insertbackground="#f8f8f2", font=("Noto Emoji", 12))
        self.content_entry.grid(row=1, column=1, padx=5, pady=5)

        self.folder_label = ttk.Label(root, text="Image Folder:")
        self.folder_label.grid(row=2, column=0, padx=5, pady=5)
        self.folder_entry = ttk.Entry(root)
        self.folder_entry.grid(row=2, column=1, padx=5, pady=5)
        self.browse_button = ttk.Button(root, text="Browse", command=self.browse_folder)
        self.browse_button.grid(row=2, column=2, padx=5, pady=5)

        self.submit_button = ttk.Button(root, text="Create Post", command=self.create_post)
        self.submit_button.grid(row=3, column=1, padx=5, pady=5)

    def browse_folder(self):
        folder_selected = filedialog.askdirectory(initialdir=image_dir)
        if folder_selected:
            self.folder_entry.insert(0, os.path.relpath(folder_selected, image_dir))

    def create_post(self):
        date = self.date_entry.get()
        content = self.content_entry.get("1.0", tk.END).strip()
        image_folder = self.folder_entry.get()
        post_id = self.get_next_post_id()

        if not date or not content or not image_folder:
            messagebox.showerror("Error", "All fields must be filled out.")
            return

        # Convert emoji codes to actual emojis
        content_with_emojis = emoji.emojize(content)

        new_post_html = create_post(date, content_with_emojis, image_folder, post_id)

        with open('index.html', 'a') as file:
            file.write(new_post_html)

        messagebox.showinfo("Success", "New post added successfully!")

    def get_next_post_id(self):
        # This function should implement a way to get the next post ID.
        # For simplicity, we are using a static value here.
        return 1

    def apply_dracula_theme(self):
        style = ttk.Style()
        style.theme_use('clam')

        # Background colors
        root.config(bg="#282a36")
        style.configure('TLabel', background="#282a36", foreground="#f8f8f2", font=('Arial', 12))
        style.configure('TEntry', fieldbackground="#44475a", background="#44475a", foreground="#f8f8f2", font=('Arial', 12))
        style.configure('TButton', background="#6272a4", foreground="#f8f8f2", font=('Arial', 12))
        style.map('TButton', background=[('active', '#50fa7b')])

if __name__ == "__main__":
    root = tk.Tk()
    app = PostApp(root)
    root.mainloop()
