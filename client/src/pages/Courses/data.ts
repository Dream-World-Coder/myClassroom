db.users.findOne({ username: "Subhajit" }).courses.forEach((course) => {
    course.videos.forEach((video) => {
        console.log(video.watched);
    });
});

/*
flaskStudyWebsite_dev> db.users.findOne({ username: "Subhajit" }).courses.forEach((course) => {
...     course.videos.forEach((video) => {
...         console.log(video.videoUrl);
...     });
... });
https://www.youtube.com/watch?v=8rrHTtUzyZA
https://www.youtube.com/watch?v=rpB6zQNsbQU
https://www.youtube.com/watch?v=a3V0BJLIo_c
https://www.youtube.com/watch?v=g8RkArhtCc4
https://www.youtube.com/watch?v=aircAruvnKk
https://www.youtube.com/watch?v=IHZwWFHWa-w
https://www.youtube.com/watch?v=Ilg3gGewQ5U
https://www.youtube.com/watch?v=tIeHLnjs5U8
https://www.youtube.com/watch?v=LPZh9BOjkQs
https://www.youtube.com/watch?v=wjZofJX0v4M
https://www.youtube.com/watch?v=eMlx5fFNoYc
https://www.youtube.com/watch?v=9-Jl0dxWQs8
https://www.youtube.com/watch?v=p_di4Zn4wz4
https://www.youtube.com/watch?v=ly4S0oi3Yz8
https://www.youtube.com/watch?v=ToIXSwZ1pJU
https://www.youtube.com/watch?v=r6sGWTCMz2k
https://www.youtube.com/watch?v=v0YEaeIClKY
https://www.youtube.com/watch?v=O85OWBJ2ayo
https://www.youtube.com/watch?v=WUvTyaaNkzM
https://www.youtube.com/watch?v=9vKqVkMQHKk
https://www.youtube.com/watch?v=S0_qX4VJhMQ
https://www.youtube.com/watch?v=YG15m2VwSjA
https://www.youtube.com/watch?v=m2MIpDrF7Es
https://www.youtube.com/watch?v=qb40J4N1fa4
https://www.youtube.com/watch?v=kfF40MiS7zA
https://www.youtube.com/watch?v=rfG8ce4nNh0
https://www.youtube.com/watch?v=FnJqaIESC2s
https://www.youtube.com/watch?v=BLkz5LGWihw
https://www.youtube.com/watch?v=3d6DsjIBzJ4
https://www.youtube.com/watch?v=CfW845LNObM
*/

db.users.findOne({ username: "Subhajit" }).courses.forEach((course) => {
    course.videos.forEach((video) => {
        if (video.videoUrl == "https://www.youtube.com/watch?v=CfW845LNObM") {
            return video;
        }
    });
});

db.users.aggregate([
    { $match: { username: "Subhajit" } },
    { $unwind: "$courses" },
    { $unwind: "$courses.videos" },
    {
        $match: {
            "courses.videos.videoUrl":
                "https://www.youtube.com/watch?v=O85OWBJ2ayo",
        },
    },
    { $project: { _id: 0, "courses.videos": 1 } },
]);

// https://youtu.be/p_di4Zn4wz4?si=5sc84PU796Cq8UGA

db.users.update_many(
    {
        username: "Subhajit",
        "courses.videos.videoUrl":
            "https://www.youtube.com/watch?v=O85OWBJ2ayo",
    },
    {
        $set: { "courses.$[].videos.$[vid].watched": true },
    },
    (array_filters = [
        { "vid.videoUrl": "https://www.youtube.com/watch?v=O85OWBJ2ayo" },
    ]),
);
