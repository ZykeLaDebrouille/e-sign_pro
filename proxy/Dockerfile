# Use the official Nginx image as base
FROM nginx:alpine

# Copy the proxy configuration file to Nginx's config directory
COPY proxy.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]