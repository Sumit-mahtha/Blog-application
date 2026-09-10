// Re-export handlers to support /api/blogs (plural) and avoid 404 errors
export { GET, POST, DELETE } from "@/app/api/blog/route";
