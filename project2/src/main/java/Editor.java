package Project2;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.sql.*;
import java.util.List;
import java.util.ArrayList;
import java.util.Date;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.commonmark.node.*;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;

/**
 * Servlet implementation class for Servlet: ConfigurationTest
 *
 */
public class Editor extends HttpServlet {
    enum Action {
        OPEN(true, true, false, false, true, false, false),
        SAVE(true, true, true, true, true, false, true),
        DELETE(true, true, false, false, true, false, true),
        PREVIEW(true, true, true, true, false, false, false),
        LIST(true, false, false, false, false, true, false);

        private boolean usernameRequired, postidRequired, titleRequired, bodyRequired, shouldPostExist, shouldUserExist, postOnly;
        
        Action (boolean ur, boolean pr, boolean tr, boolean br, boolean spe, boolean sue, boolean po) {
            this.usernameRequired = ur;
            this.postidRequired = pr;
            this.titleRequired = tr;
            this.bodyRequired = br;
            this.shouldPostExist = spe;
            this.shouldUserExist = sue;
            this.postOnly = po;
        }

        boolean usernameRequired() { return usernameRequired; }
        boolean postidRequired() { return postidRequired; }
        boolean titleRequired() { return titleRequired; }
        boolean bodyRequired() { return bodyRequired; }
        boolean shouldPostExist() { return shouldPostExist; }
        boolean shouldUserExist() { return shouldUserExist; }
        boolean postOnly() { return postOnly; }
    };

    public class Post {
        private String username, title, body, created, modified;
        private int postid;

        Post(String u, int p, String t, String b, String c, String m) {
            this.username = u;
            this.postid = p;
            this.title = t;
            this.body = b;
            this.created = c;
            this.modified = m;
        }

        Post(String u, int p, String t, String b) {
            this.username = u;
            this.postid = p;
            this.title = t;
            this.body = b;
        }

        public String getUsername() { return username; }
        public int getPostid() { return postid; }
        public String getTitle() { return title; }
        public String getBody() { return body; }
        public String getCreated() { return created; }
        public String getModified() { return modified; }

        public int delete() {
            Connection c = null;
            PreparedStatement lookupPostStatement = null;
            ResultSet rs = null;
            int ret = 0;
            try {
                c = DriverManager.getConnection("jdbc:mariadb://localhost:3306/CS144", "cs144", ""); 
                lookupPostStatement = c.prepareStatement(DELETE_POST_QUERY);
                lookupPostStatement.setString(1, username);
                lookupPostStatement.setInt(2, postid);

                rs = lookupPostStatement.executeQuery();
            } catch (Exception e) { ret = 1; } finally {
                try { rs.close(); } catch (Exception e) { /* ignored */ }
                try { lookupPostStatement.close(); } catch (Exception e) { /* ignored */ }
                try { c.close(); } catch (Exception e) { /* ignored */ }
            }

            return ret;
        }

        public int save() {
            Connection c = null;
            PreparedStatement lookupPostStatement = null;
            PreparedStatement getIdStatement = null;
            ResultSet rs = null;
            int ret = 0;
            try {
                c = DriverManager.getConnection("jdbc:mariadb://localhost:3306/CS144", "cs144", ""); 
                getIdStatement = c.prepareStatement(LARGEST_POSTID_QUERY);
                getIdStatement.setString(1, username);

                rs = getIdStatement.executeQuery();
                postid = 1;
                while (rs.next()) {
                    postid += rs.getInt("postid");
                }

                lookupPostStatement = c.prepareStatement(CREATE_QUERY);
                lookupPostStatement.setString(1, username);
                lookupPostStatement.setInt(2, postid);
                lookupPostStatement.setString(3, title);
                lookupPostStatement.setString(4, body);

                ret = lookupPostStatement.executeUpdate();
            } catch (Exception e) { ret = 1; } finally {
                try { lookupPostStatement.close(); } catch (Exception e) { /* ignored */ }
                try { getIdStatement.close(); } catch (Exception e) { /* ignored */ }
                try { c.close(); } catch (Exception e) { /* ignored */ }
            }

            return ret;
        }

        public int update() {
            Connection c = null;
            PreparedStatement lookupPostStatement = null;
            int ret = 0;
            try {
                c = DriverManager.getConnection("jdbc:mariadb://localhost:3306/CS144", "cs144", ""); 
                lookupPostStatement = c.prepareStatement(UPDATE_QUERY);
                lookupPostStatement.setString(1, title);
                lookupPostStatement.setString(2, body);
                lookupPostStatement.setString(3, username);
                lookupPostStatement.setInt(4, postid);
                

                ret = lookupPostStatement.executeUpdate();
            } catch (Exception e) { ret = 1; } finally {
                try { lookupPostStatement.close(); } catch (Exception e) { /* ignored */ }
                try { c.close(); } catch (Exception e) { /* ignored */ }
            }

            return ret;
        }
    };

    // For save
    String UPDATE_QUERY = "UPDATE Posts SET title = ?, body = ? WHERE username = ? AND postid = ?";
    String DELETE_POST_QUERY = "DELETE FROM Posts WHERE username = ? AND postid = ?";
    String LARGEST_POSTID_QUERY = "SELECT postid FROM Posts WHERE username = ? ORDER BY postid DESC LIMIT 1";
    String CREATE_QUERY = "INSERT INTO Posts (username, postid, title, body) VALUES(?, ?, ?, ?)";
    // For open/save/delete
    String FETCH_POST_QUERY = "SELECT * FROM Posts WHERE username = ? AND postid = ?";
    // For list
    String LIST_POST_QUERY = "SELECT * FROM Posts WHERE username = ?";

    /**
     * The Servlet constructor
     * 
     * @see javax.servlet.http.HttpServlet#HttpServlet()
     */
    public Editor() {}

    public void init() throws ServletException
    {
        /*  write any servlet initialization code here or remove this function */
    }  
    
    public void destroy()   
    {
        /*  write any servlet cleanup code here or remove this function */
    }

    public int processRequest(HttpServletRequest request, boolean isPost)
    {
        String action = request.getParameter("action");
        String username = request.getParameter("username");
        String postid = request.getParameter("postid");
        String title = (request.getParameter("title") != null) ? request.getParameter("title") : "";
        String body = (request.getParameter("body") != null) ? request.getParameter("body") : "";
        // check
        Action a = null;
        try {
            a = Action.valueOf((action != null) ? action.toUpperCase() : "");
        } catch (Exception e) { }

        if (a == null || (a.postOnly() && !isPost)) {
            // should be SC_BAD_REQUEST
            return HttpServletResponse.SC_BAD_REQUEST;
        }

        // Check parameters and set request attributes
        boolean badRequest = false;
        Integer postidInt = 0;
        if (a.usernameRequired()) {
            badRequest = (badRequest) ? badRequest : (username == null);
        }
        if (a.postidRequired()) {
            try {
                postidInt = Integer.parseInt(postid);
            } catch (Exception e) {
                badRequest = true;
            }
        }
        if (a.titleRequired()) {
            badRequest = (badRequest) ? badRequest : (request.getParameter("title") == null);
        }
        if (a.bodyRequired()) {
            badRequest = (badRequest) ? badRequest : (request.getParameter("body") == null);
        }

        if (badRequest) {
            // Should be SC_BAD_REQUEST
            return HttpServletResponse.SC_BAD_REQUEST;  
        }

        if (a.shouldPostExist() && postidInt != 0) {
            Editor.Post post = this.getPost(username, postidInt);
            request.setAttribute("postData", post);
            if (post != null && title.length() == 0 && body.length() == 0) {
                title = post.getTitle();
                body = post.getBody();
            }
        }
        if (a.shouldUserExist()) {
            request.setAttribute("postsData", this.getUserPosts(username));
        }

        request.setAttribute("jspPage", "/edit.jsp");
        if (a.equals(Action.OPEN)) {
            if (postidInt == 0 || title != "" || body != "") {
                request.setAttribute("postData", this.new Post(username, postidInt, title, body));
            } else if (request.getAttribute("postData") == null) {
                return HttpServletResponse.SC_NOT_FOUND;
            }
        } else if (a.equals(Action.SAVE)) {
            Editor.Post post = this.new Post(username, postidInt, title, body);
            if (postidInt == 0) {
                post.save();
            } else {
                if (request.getAttribute("postData") == null) {
                    return HttpServletResponse.SC_NOT_FOUND;
                }
                post.update();
            }
            request.setAttribute("username", username);
            request.setAttribute("jspPage", "/listRedirect.jsp");
        } else if (a.equals(Action.DELETE)) {
            if (request.getAttribute("postData") == null) {
                return HttpServletResponse.SC_NOT_FOUND;
            }
            Editor.Post post = this.new Post(username, postidInt, title, body);
            request.setAttribute("username", username);
            request.setAttribute("jspPage", "/listRedirect.jsp");
            post.delete();
        } else if (a.equals(Action.LIST)) {
            List<Editor.Post> postList = (List<Editor.Post>)(List<?>) request.getAttribute("postsData");
            if (postList.size() == 0) {
                return HttpServletResponse.SC_NOT_FOUND;
            }
            request.setAttribute("username", username);
            request.setAttribute("jspPage", "/list.jsp");
        } else if (a.equals(Action.PREVIEW)) {
            request.setAttribute("postData", this.new Post(username, postidInt, title, body));           

            Parser parser = Parser.builder().build();
            HtmlRenderer renderer = HtmlRenderer.builder().build();

            request.setAttribute("titleHtml", renderer.render(parser.parse(title))); 
            request.setAttribute("bodyHtml", renderer.render(parser.parse(body))); 

            request.setAttribute("jspPage", "/preview.jsp");
        }


        return HttpServletResponse.SC_OK;
    }

    public static String encodeURIComponent(String s) {
        String result;

        result = URLEncoder.encode(s, StandardCharsets.UTF_8);
        
        return result;
    }

    public Editor.Post getPost(String username, int postid) {
        Editor.Post post = null;
        Connection c = null;
        PreparedStatement lookupPostStatement = null;
        ResultSet rs = null;
        try {
            c = DriverManager.getConnection("jdbc:mariadb://localhost:3306/CS144", "cs144", ""); 
            lookupPostStatement = c.prepareStatement(FETCH_POST_QUERY);
            lookupPostStatement.setString(1, username);
            lookupPostStatement.setInt(2, postid);

            rs = lookupPostStatement.executeQuery();

            while (rs.next()) {
                post = this.new Post(username, postid, rs.getString("title"), rs.getString("body"), rs.getString("created"), rs.getString("modified"));
            }

        } catch (Exception e) { } finally {
            try { rs.close(); } catch (Exception e) { /* ignored */ }
            try { lookupPostStatement.close(); } catch (Exception e) { /* ignored */ }
            try { c.close(); } catch (Exception e) { /* ignored */ }
        }

        return post;
    }

    public List<Editor.Post> getUserPosts(String username) {
        List<Editor.Post> posts = new ArrayList<Editor.Post>();
        Connection c = null;
        PreparedStatement lookupUserStatement = null;
        ResultSet rs = null;
        try {
            c = DriverManager.getConnection("jdbc:mariadb://localhost:3306/CS144", "cs144", ""); 
            lookupUserStatement = c.prepareStatement(LIST_POST_QUERY);
            lookupUserStatement.setString(1, username);

            rs = lookupUserStatement.executeQuery();
            
            while (rs.next()) {
                Post post = this.new Post(username, rs.getInt("postid"), rs.getString("title"), rs.getString("body"), rs.getString("created"), rs.getString("modified"));
                posts.add(post);
            }

        } catch (Exception e) { } finally {
            try { rs.close(); } catch (Exception e) { /* ignored */ }
            try { lookupUserStatement.close(); } catch (Exception e) { /* ignored */ }
            try { c.close(); } catch (Exception e) { /* ignored */ }
        }
        
        return posts;
    }

    public void writeErrorPage(HttpServletResponse response, int statusCode) throws IOException{
        PrintWriter out = response.getWriter();
        out.println("<!DOCTYPE html>");
        out.println("<html>");
        out.println("<head><title>Error</title></head>");
        out.println("<body>HTTP Status: " + statusCode + "!<br>");
        out.println("</html>");
        out.close();
    }
        
    /**
     * Handles HTTP GET requests
     * 
     * @see javax.servlet.http.HttpServlet#doGet(HttpServletRequest request,
     *      HttpServletResponse response)
     */
    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException 
    {
	// implement your GET method handling code here
	// currently we simply show the page generated by "edit.jsp"

        int status = this.processRequest(request, false);
        response.setStatus(status);

        if (status != HttpServletResponse.SC_OK) {
            this.writeErrorPage(response, status);
            return;
        }

        request.getRequestDispatcher((String)request.getAttribute("jspPage")).forward(request, response);
    }

    /**
     * Handles HTTP POST requests
     *  
     * @see javax.servlet.http.HttpServlet#doPost(HttpServletRequest request,
     *      HttpServletResponse response)
     */
    public void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException 
    {
        int status = this.processRequest(request, true);
        response.setStatus(status);

        if (status != HttpServletResponse.SC_OK) {
            this.writeErrorPage(response, status);
            return;
        }

        request.getRequestDispatcher((String)request.getAttribute("jspPage")).forward(request, response);
    }
}

