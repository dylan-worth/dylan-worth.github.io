import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export default function BlogPostWriter() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Load saved posts from LocalStorage
    const savedPosts = JSON.parse(localStorage.getItem("blogPosts")) || [];
    setPosts(savedPosts);
  }, []);

  const handlePost = () => {
    if (!title || !description || !content) {
      alert("Title, description, and content are required!");
      return;
    }

    const blogFileName = title.toLowerCase().replace(/\s+/g, "-") + ".html";
    const blogContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <article>
          <h1>${title}</h1>
          <p><em>${description}</em></p>
          <div>${content}</div>
        </article>
      </body>
      </html>
    `;

    // Save post to LocalStorage
    const newPost = { title, description, filename: blogFileName };
    const updatedPosts = [...posts, newPost];
    localStorage.setItem("blogPosts", JSON.stringify(updatedPosts));
    setPosts(updatedPosts);

    // Create a downloadable HTML file
    const blob = new Blob([blogContent], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = blogFileName;
    a.click();

    alert("Blog post created! Downloading file...");
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <Card>
        <CardContent className="p-4 space-y-3">
          <Input placeholder="Blog Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="Short description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div 
            contentEditable 
            className="border p-2 min-h-[150px] rounded-md" 
            onInput={(e) => setContent(e.currentTarget.innerHTML)}
          >
            Write your blog content here...
          </div>
          <Button onClick={handlePost} className="w-full">Publish Blog</Button>
        </CardContent>
      </Card>

      {/* Display stored blog posts */}
      <div className="mt-4">
        <h2>Saved Blog Posts</h2>
        <ul>
          {posts.map((post, index) => (
            <li key={index}>
              <a href={`/blogs/${post.filename}`} download>{post.title}</a> - {post.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
