/**
 * BlogManager - Blog data and content management
 * The Heart of Gold
 */

class BlogManager {
    constructor() {
        this.blogs = [
            {
                id: '01',
                date: 'February, 2025',
                title: 'Official Site Launch',
                description: 'Welcome to the official site of The Heart of Gold!',
                category: 'notices',
                featured: true,
                image: './src/assets/Officialsitecover.png',
                previewImage: './src/assets/Officialsitecover.png',
                content: `
                    <h2>Welcome!</h2>
                    <p>You've found our new home on the web! We're excited to launch the official website for The Heart of Gold.</p>
                    
                    <h3>What You'll Find Here</h3>
                    <p>This site will be your central hub for all things related to the game. News updates, character information, gameplay guides, and community events will all be posted here.</p>
                    
                    <h3>Stay Connected</h3>
                    <p>Make sure to bookmark this page and follow us on social media to stay up to date with the latest announcements. We have big things planned!</p>
                    
                    <h3>Thank You</h3>
                    <p>From the entire development team, thank you for your interest and support. This website represents another milestone in our journey, and we couldn't have reached it without you.</p>
                    
                    <p>Here's to many more adventures together!</p>
                `
            }
        ];
    }

    getAllBlogs() {
        return this.blogs;
    }

    getBlogById(id) {
        return this.blogs.find(blog => blog.id === id);
    }

    getBlogsByCategory(category) {
        if (category === 'latest') {
            return this.blogs;
        }
        return this.blogs.filter(blog => blog.category === category);
    }

    getFeaturedBlogs() {
        return this.blogs.filter(blog => blog.featured);
    }

    getNextBlog(currentId) {
        const currentIndex = this.blogs.findIndex(blog => blog.id === currentId);
        if (currentIndex === -1 || currentIndex >= this.blogs.length - 1) {
            return null;
        }
        return this.blogs[currentIndex + 1];
    }

    getPreviousBlog(currentId) {
        const currentIndex = this.blogs.findIndex(blog => blog.id === currentId);
        if (currentIndex <= 0) {
            return null;
        }
        return this.blogs[currentIndex - 1];
    }
}

export const blogManager = new BlogManager();
export default blogManager;
