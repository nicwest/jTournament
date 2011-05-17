jTournament
===========

Makes jQuery make tournament trees using canvas, from json. Tis very messy at the moment.

Use me
------

requires jQuery, add to <head> tag:

    <head>
     <title>jTournament</title>
     <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script> 
     <script src="tourney.js"></script>
    </head>

Define canvas in <body>:

    <body>
     <canvas id="tournament"></canvas>
     (there can be what ever else you like here)
    </body>

You need your tournament data in JSON form as follows:

    <script>
    var matchInfo = {
        "rounds": [{
            "name": "Round1",
                "matches": [{
                "p1": "Bill",
                "p2": "Bob",
                "winner": 1
            }, {
                "p1": "Sam",
                "p2": "Duddly",
                "winner": 2
            }, {
                "p1": "Andy",
                "p2": "Biff",
                "winner": 1
            }, {
                "p1": "Phill",
                "p2": "Peter",
                "winner": 1
            }, {
                "p1": "John",
                "p2": "Dave",
                "winner": 2
            }, {
                "p1": "Xaus",
                "p2": "James",
                "winner": 2
            }, {
                "p1": "Kenny",
                "p2": "Nick",
                "winner": 1
            }, {
                "p1": "Fred",
                "p2": "Pat",
                "winner": 2
            }]
        }, {
            "name": "Round2",
            "matches": [{
                "p1": null,
                "p2": null
            }, {
                "p1": null,
                "p2": null
            }, {
                "p1": null,
                "p2": null
            }, {
                "p1": null,
                "p2": null
            }]
        }, {
            "name": "Round3",
            "matches": [{
                "p1": null,
                "p2": null
            }, {
                "p1": null,
                "p2": null
            }]
        }, {
            "name": "Round4",
            "matches": [{
                "p1": null,
                "p2": null
            }, ]
        }]
    };
    </script>

options:

    <script>
    var options = {
        width: 40,
        height: 30,
        v_spacing: 10,
        h_spacing: 10,
        background_color: "#545454",
        border_color: "#000000",
        border_width: "1",
        bracket_color: "#000000",
        bracket_width: "2",
        text_color: "#000000",
        text_color_loss: "#000000",
        text_style: "italic 11px verdana",
        gradient: false
    }
    </script>

Finally instigate the thingy like this:

    <script>
        $(document).ready(function () {
            $('#test').maketourney(options, matchInfo);
        }
    </script>

Gradients
---------

They are fun and work like this:

    <script>
    var options = {gradient: [{loc: 0, color: '#4F4F4F'},
                              {loc: 0.5, color: '#1B1B1B'},
                              {loc: 0.5, color: '#000000'}]};
    // where loc is the location on graident scale from 0 to 1 and the color is the color at that location;
    </script>
