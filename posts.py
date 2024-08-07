import os
from datetime import datetime
import tkinter as tk
from tkinter import ttk, filedialog, messagebox, font, colorchooser
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

        # Create main frame first
        self.main_frame = ttk.Frame(root)
        self.main_frame.pack(padx=10, pady=10, fill=tk.BOTH, expand=True)

        # Apply Dracula theme after creating UI components
        self.apply_dracula_theme()

        # Date input
        self.date_label = ttk.Label(self.main_frame, text="Date:")
        self.date_label.pack(anchor='w', padx=5, pady=5)
        self.date_entry = ttk.Entry(self.main_frame)
        self.date_entry.pack(fill=tk.X, padx=5, pady=5)
        self.date_entry.insert(0, datetime.now().strftime("%B %d, %Y"))

        # Content input
        self.content_label = ttk.Label(self.main_frame, text="Content:")
        self.content_label.pack(anchor='w', padx=5, pady=5)
        self.content_entry = tk.Text(self.main_frame, height=30, bg="#44475a", fg="#f8f8f2", insertbackground="#f8f8f2", font=("Noto Emoji", 12))
        self.content_entry.pack(fill=tk.X, padx=5, pady=5)

        # Image folder input
        self.folder_label = ttk.Label(self.main_frame, text="Image Folder:")
        self.folder_label.pack(anchor='w', padx=5, pady=5)
        self.folder_entry = ttk.Entry(self.main_frame)
        self.folder_entry.pack(fill=tk.X, padx=5, pady=5)
        self.browse_button = ttk.Button(self.main_frame, text="Browse", command=self.browse_folder)
        self.browse_button.pack(padx=5, pady=5)

        # Font settings
        self.font_label = ttk.Label(self.main_frame, text="Font Style:")
        self.font_label.pack(anchor='w', padx=5, pady=5)
        self.font_var = tk.StringVar(value="Noto Emoji")
        self.font_menu = ttk.Combobox(self.main_frame, textvariable=self.font_var, values=font.families())
        self.font_menu.pack(fill=tk.X, padx=5, pady=5)

        self.size_label = ttk.Label(self.main_frame, text="Font Size:")
        self.size_label.pack(anchor='w', padx=5, pady=5)
        self.size_var = tk.IntVar(value=12)
        self.size_spinbox = tk.Spinbox(self.main_frame, from_=8, to=72, textvariable=self.size_var)
        self.size_spinbox.pack(fill=tk.X, padx=5, pady=5)

        self.color_button = ttk.Button(self.main_frame, text="Font Color", command=self.choose_color)
        self.color_button.pack(padx=5, pady=5)

        self.bold_button = ttk.Checkbutton(self.main_frame, text="Bold", command=self.toggle_bold)
        self.bold_button.pack(anchor='w', padx=5, pady=5)

        self.italic_button = ttk.Checkbutton(self.main_frame, text="Italic", command=self.toggle_italic)
        self.italic_button.pack(anchor='w', padx=5, pady=5)

        # Submit button
        self.submit_button = ttk.Button(self.main_frame, text="Create Post", command=self.create_post)
        self.submit_button.pack(padx=5, pady=10)

    def browse_folder(self):
        folder_selected = filedialog.askdirectory(initialdir=image_dir)
        if folder_selected:
            self.folder_entry.delete(0, tk.END)
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

        # Define a new style for the frame
        style.configure('Dracula.TFrame', background="#282a36")
        
        # Configure other styles
        style.configure('TLabel', background="#282a36", foreground="#f8f8f2", font=('Arial', 12))
        style.configure('TEntry', fieldbackground="#44475a", background="#44475a", foreground="#f8f8f2", font=('Arial', 12))
        style.configure('TButton', background="#6272a4", foreground="#f8f8f2", font=('Arial', 12))
        style.map('TButton', background=[('active', '#50fa7b')])

        # Apply the frame style
        self.main_frame.configure(style='Dracula.TFrame')

        # Set background color for non-ttk widgets
        self.root.config(bg="#282a36")

    def choose_color(self):
        color_code = colorchooser.askcolor(title="Choose Font Color")[1]
        if color_code:
            self.content_entry.configure(fg=color_code)

    def toggle_bold(self):
        current_font = font.nametofont(self.content_entry.cget("font"))
        weight = current_font.actual()["weight"]
        new_weight = "bold" if weight == "normal" else "normal"
        current_font.configure(weight=new_weight)
        self.content_entry.configure(font=current_font)

    def toggle_italic(self):
        current_font = font.nametofont(self.content_entry.cget("font"))
        slant = current_font.actual()["slant"]
        new_slant = "italic" if slant == "roman" else "roman"
        current_font.configure(slant=new_slant)
        self.content_entry.configure(font=current_font)

if __name__ == "__main__":
    root = tk.Tk()
    app = PostApp(root)
    root.mainloop()
