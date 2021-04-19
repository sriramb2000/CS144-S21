<%@ page import="Project2.Editor" %>
    <%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
        <%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
            <!DOCTYPE html>
            <html>

            <body>
                <% Project2.Editor.Post post = (Project2.Editor.Post)request.getAttribute("postData"); %>
                    <div>
                        <h1>Edit Post</h1>
                    </div>
                    <div>
                        <form action="post" method="POST">
                            <input type="hidden" name="username" value="<%= post.getUsername() %>">
                            <input type="hidden" name="postid" value="<%= post.getPostid() %>">
                            <input type="hidden" name="title" value="<%= post.getTitle() %>">
                            <input type="hidden" name="body" value="<%= post.getBody() %>">
                            <div>
                                <button type="submit" name="action" value="open">Close Preview</button>
                            </div>
                        </form>
                    </div>
                    <h1 id="title">
                        <%= request.getAttribute("titleHtml") %>
                    </h1>
                    <div id="body">
                        <%= request.getAttribute("bodyHtml") %>
                    </div>
            </body>

            </html>