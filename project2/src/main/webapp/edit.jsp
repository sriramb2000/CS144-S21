<%@ page import="Project2.Editor" %>
    <%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
        <%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
            <!DOCTYPE html>
            <html>

            <head>
                <meta charset="UTF-8">
                <title>Edit Post</title>
            </head>

            <body>
                <% Project2.Editor.Post post = (Project2.Editor.Post)request.getAttribute("postData"); %>
                    <div>
                        <h1>Edit Post</h1>
                    </div>
                    <form action="post" method="POST">
                        <input type="hidden" name="username" value="<%= post.getUsername() %>">
                        <input type="hidden" name="postid" value="<%= post.getPostid() %>">
                        <div>
                            <button type="submit" name="action" value="save">Save</button>
                            <button type="submit" name="action" value="list">Close</button>
                            <button type="submit" name="action" value="preview">Preview</button>
                            <button type="submit" name="action" value="delete">Delete</button>
                        </div>
                        <div>
                            <label for="title">Title</label>

                            <input type="text" name="title" value="<%= post.getTitle() %>">
                        </div>
                        <div>
                            <label for="body">Body</label>
                            <textarea style="height: 20rem;" id="body" name="body"><%= post.getBody() %></textarea>
                        </div>
                    </form>
            </body>

            </html>