"""
DISCLAIMER: This sample code for illustration purposes only. 
            It doesn't necessarily use the corret server API from our earlier projects.
"""

import sys, time, random
from locust import HttpUser, task, between

class MyUser(HttpUser):
    wait_time = between(1, 2)

    @task
    def list(self):
        self.client.get('/api/posts?username=cs144')
        self.client.get('/editor/post?action=list&username=cs144')

    @task(2)
    def preview(self):
        # generate a random postid between 1 and 100
        postid = random.randint(1, 100)
        self.client.get("/blog/cs144/" + str(postid), name="/blog/cs144/")

    def on_start(self):
        """on_start is called when a Locust start before any task is scheduled"""
        res = self.client.post("/login", data={"username":"cs144", "password": "password"})
        if res.status_code != 200:
            print("Failed to authenticate the cs144 user on the server")
            sys.exit();