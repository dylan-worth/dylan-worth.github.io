from tkinter import Tk, PhotoImage, Label

root = Tk()
image = Image.open('font_bold.gif')  # Pillow supports many formats
photo = ImageTk.PhotoImage(image)
label = Label(root, image=photo)
label.pack()
root.mainloop()
