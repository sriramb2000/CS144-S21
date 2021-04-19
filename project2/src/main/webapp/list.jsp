<%@ page import="Project2.Editor" %>
    <%@ page import="java.util.List" %>
        <%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
            <%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
                <!DOCTYPE html>
                <html>

                <head>
                    <meta charset="UTF-8">
                    <title>Edit Post</title>
                </head>

                <body>
                    <div>
                        <form action="post" id="-1">
                            <input type="hidden" name="username" value="${username}">
                            <input type="hidden" name="postid" value="0">
                            <button type="submit" name="action" value="open">New Post</button>
                        </form>
                    </div>
                    <table>
                        <tbody>
                            <tr>
                                <th>Title</th>
                                <th>Created</th>
                                <th>Modified</th>
                                <th>&nbsp;</th>
                            </tr>
                            <c:forEach var="post" items="${postsData}" varStatus="loopCounter">
                                <tr>
                                    <form id="${loopCounter.count}" action="post" method="POST">
                                        <input type="hidden" name="username" value="${post.getUsername()}">
                                        <input type="hidden" name="postid" value="${post.getPostid()}">
                                        <td>
                                            ${post.getTitle()}
                                        </td>
                                        <td>
                                            ${post.getCreated()}
                                        </td>
                                        <td>
                                            ${post.getModified()}
                                        </td>
                                        <td>
                                            <button type="submit" name="action" value="open">Open</button>
                                            <button type="submit" name="action" value="delete">Delete</button>
                                        </td>
                                    </form>
                                </tr>
                            </c:forEach>
                        </tbody>
                    </table>
                </body>

                </html>