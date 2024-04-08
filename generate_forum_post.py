import tkinter as tk
from tkinter import ttk, messagebox, filedialog
from tkinter import PhotoImage
from datetime import datetime


def update_word_count(event=None):
    words = len(text_editor.get("1.0", 'end-1c').split())
    word_count_label.config(text=f"Word Count: {words}")

def apply_tag(tag):
    try:
        current_tags = text_editor.tag_names("sel.first")
        if tag in current_tags:
            text_editor.tag_remove(tag, "sel.first", "sel.last")
        else:
            text_editor.tag_add(tag, "sel.first", "sel.last")
    except tk.TclError:
        pass  # No text selected

def change_font_size(event=None):
    new_size = font_size_combo.get()
    text_editor.config(font=("Arial", new_size))




def save_forum_post():
    content = text_editor.get("1.0", tk.END)
    title = title_entry.get()
    author = author_entry.get()
    # Fetch the current local date and time
    current_time = datetime.now()
    # Format the date and time as you like, here it's "Month Day, Year"
    date = current_time.strftime("%B %d, %Y")
    
    if not title or not author:
        messagebox.showerror("Error", "Title and author are required.")
        return
    
    filename = filedialog.asksaveasfilename(defaultextension=".html",
                                            filetypes=[("HTML Files", "*.html"), ("All Files", "*.*")])
    if not filename:
        return  # User cancelled; don't proceed

    html_content = generate_html_forum_post(title, author, date, content)

    try:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(html_content)
        messagebox.showinfo("Success", "The forum post has been saved successfully!")
    except Exception as e:
        messagebox.showerror("Error", "Failed to save the file.\n" + str(e))

def generate_html_forum_post(title, author, date, content):
    """
    Generates HTML content for a forum topic post, including a navigation bar and links to CSS files.
    """
    # Properly format the content to replace newlines with <br> for HTML display
    formatted_content = content.replace('\n', '<br>\n                ')
    
    html_template = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/x-icon" href="/images/icons/clown-fish.png">
    <link rel="stylesheet" href="../css/forum.css">
    <link rel="stylesheet" href="../css/homepage.css">
    <title>{title}</title>
</head>
<body>
    <nav class="navbar">
        <div class="navbar-inner">
            <a href="../../index.html" class="navbar-brand">Home</a>
            <div class="navbar-links">
                <a href="../blog.html">Blogs</a>
                <a href="../dreams.html">Dreams</a>
                <a href="../about.html">About</a>
                <a href="../photos.html">Photos</a>
                <a href="../videos.html">Videos</a>
            </div>
        </div>
    </nav>
    <div class="forum-topic">
        <header class="topic-header">
            <h1>{title}</h1>
            <div class="user-info">
                <img src="../../../images/profile/pfp.jpg" alt="User Avatar" class="user-avatar">
                <div class="user-details">
                    <span class="username">{author}</span>
                    <span class="post-date">{date}</span>
                </div>
            </div>
        </header>
        <div class="topic-content">
            {formatted_content}
        </div>
    </div>
</body>
</html>"""
    return html_template

app = tk.Tk()
app.title("Forum Post Creator by Dylan Worth")
app.config(bg='#2D2D2D')  # Dark background color for the app

# Text editor setup



# Title and author input fields
title_label = ttk.Label(app, text="Title:")
title_label.pack(fill='x', padx=5, pady=5)
title_entry = ttk.Entry(app)
title_entry.pack(fill='x', padx=5, pady=5)

author_label = ttk.Label(app, text="Author:")
author_label.pack(fill='x', padx=5, pady=5)
author_entry = ttk.Entry(app)
author_entry.pack(fill='x', padx=5, pady=5)


text_editor = tk.Text(app, wrap="word", font=("Arial", 12), undo=True, bg='#404040', fg='#C7C7C7', insertbackground='white')  # Dark theme colors
text_editor.pack(expand=True, fill='both', padx=10, pady=10)
text_editor.bind("<KeyRelease>", update_word_count)

toolbar = tk.Frame(app)
toolbar.pack(fill='x')
toolbar = tk.Frame(app, bg='#333333')
toolbar.pack(side='bottom', fill='x')

bold_icon = PhotoImage(file='font_bold.gif')
italic_icon = PhotoImage(file='font_italic.gif')
underline_icon = PhotoImage(file='font_underline.gif')

bold_btn = tk.Button(toolbar, image=bold_icon, command=lambda: apply_tag('bold'))
bold_btn.pack(side='left', padx=2, pady=2)
italic_btn = tk.Button(toolbar, image=italic_icon, command=lambda: apply_tag('italic'))
italic_btn.pack(side='left', padx=2, pady=2)
underline_btn = tk.Button(toolbar, image=underline_icon, command=lambda: apply_tag('underline'))
underline_btn.pack(side='left', padx=2, pady=2)
bold_btn.config(bg='#333333', activebackground='#333333')
italic_btn.config(bg='#333333', activebackground='#333333')
underline_btn.config(bg='#333333', activebackground='#333333')
text_editor.tag_configure('bold', font=('Arial', 12, 'bold'))
text_editor.tag_configure('italic', font=('Arial', 12, 'italic'))
text_editor.tag_configure('underline', font=('Arial', 12, 'underline'))



font_size_combo = ttk.Combobox(toolbar, width=3, values=[str(size) for size in range(8, 33)])
font_size_combo.current(4)
font_size_combo.bind("<<ComboboxSelected>>", change_font_size)
font_size_combo.pack(side='left')

label = ttk.Label(toolbar, text="Text Editor Toolbar", background='#333333', foreground='white')
label.pack(side='left', padx=10)



word_count_label = ttk.Label(toolbar, text="Word Count: 0")
word_count_label.pack(side='right')


ttk.Button(toolbar, text="Submit", command=save_forum_post).pack(side='right')


app.mainloop()
