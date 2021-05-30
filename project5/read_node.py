"""
DISCLAIMER: This sample code for illustration purposes only. 
            It doesn't necessarily use the corret server API from our earlier projects.
"""

import sys, time, random
from locust import HttpUser, task, between

class MyUser(HttpUser):
    wait_time = between(0.5, 1)

    @task
    def open_post(self):
        # generate a random postid between 1 and 100
        postid = random.randint(1, 500)
        self.client.get('/blog/cs144/{}'.format(postid), name="/blog/cs144")

    def on_start(self):
        """on_start is called when a Locust start before any task is scheduled"""
        pass