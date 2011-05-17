(function ($) {

    $.fn.maketourney = function (settings, data) {


        var ds = {
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
        };

        $.extend(ds, settings);
        this.settings = ds;
        this.rounds = data.rounds.length;
        this.players = (data.rounds[0].matches.length * 2);

        this.attr('height', this.players * (this.settings.height + this.settings.v_spacing));
        this.attr('width', this.rounds * (this.settings.width + this.settings.h_spacing));
        if (this[0].getContext) {
            var ctx = this[0].getContext('2d');
            // drawing code here
        } else {
            alert("Your Browser Fails, please download something from the 21st century");
        }

        function makegrad(in_var) {
            if (settings.gradient) {
                var gradient2 = ctx.createLinearGradient(0, in_var, 0, in_var + settings.height);
                for (k = 0; k < settings.gradient.length; k++) {
                    gradient2.addColorStop(settings.gradient[k].loc, settings.gradient[k].color);
                }

                return (gradient2);
            } else {
                return (settings.background_color);
            }
        }
        ctx.fillStyle = this.settings.background_color;
        ctx.strokeStyle = this.settings.border_color; // red
        ctx.lineWidth = this.settings.border_width;
        ctx.font = this.settings.text_style;
        ctx.textBaseline = 'top';

        for (i = 0; i < (this.rounds); i++) {
            for (j = 0; j < (data.rounds[i].matches.length * 2); j++) {
                var c = (Math.pow(2, (i)));
                var n = j + 1;
                var yloc = (c * n) + (1 - c);
                var yloc_next = ((Math.pow(2, (i + 1))) * (Math.ceil((j + 1) / 2))) + (1 - (Math.pow(2, (i + 1))));
                var ygap = ((c * (n + 1)) + (1 - c)) - yloc;
                var yadj = ygap / 2;
                var ygap_next = ((Math.pow(2, (i + 1))) * (Math.ceil((j + 1) / 2) + 1)) + (1 - (Math.pow(2, (i + 1)))) - yloc_next;
                var yadj_next = ygap_next / 2;

                ctx.fillStyle = makegrad((yloc * (this.settings.height + this.settings.v_spacing)) + (yadj * (this.settings.height + this.settings.v_spacing)) - ((this.settings.height + this.settings.v_spacing) * 1.5));
                ctx.fillRect((i * (this.settings.width + this.settings.h_spacing)), (yloc * (this.settings.height + this.settings.v_spacing)) + (yadj * (this.settings.height + this.settings.v_spacing)) - ((this.settings.height + this.settings.v_spacing) * 1.5), this.settings.width, this.settings.height);
                if (this.settings.border_width > 0) {
                    ctx.strokeRect((i * (this.settings.width + this.settings.h_spacing)), (yloc * (this.settings.height + this.settings.v_spacing)) + (yadj * (this.settings.height + this.settings.v_spacing)) - ((this.settings.height + this.settings.v_spacing) * 1.5), this.settings.width, this.settings.height);
                }

                ctx.strokeStyle = this.settings.bracket_color;
                ctx.lineWidth = this.settings.bracket_width;
                ctx.beginPath();
                ctx.moveTo(((i * (this.settings.width + this.settings.h_spacing)) + this.settings.width), (yloc * (this.settings.height + this.settings.v_spacing)) + (yadj * (this.settings.height + this.settings.v_spacing)) - ((this.settings.height + this.settings.v_spacing) * 1.5) + (this.settings.height / 2));
                ctx.lineTo(((i * (this.settings.width + this.settings.h_spacing)) + this.settings.width + (this.settings.h_spacing / 2)), (yloc * (this.settings.height + this.settings.v_spacing)) + (yadj * (this.settings.height + this.settings.v_spacing)) - ((this.settings.height + this.settings.v_spacing) * 1.5) + (this.settings.height / 2));

                ctx.lineTo(((i * (this.settings.width + this.settings.h_spacing)) + this.settings.width + (this.settings.h_spacing / 2)), (yloc_next * (this.settings.height + this.settings.v_spacing)) + (yadj_next * (this.settings.height + this.settings.v_spacing)) - ((this.settings.height + this.settings.v_spacing) * 1.5) + (this.settings.height / 2));
                ctx.lineTo(((i * (this.settings.width + this.settings.h_spacing)) + this.settings.width + (this.settings.h_spacing)), (yloc_next * (this.settings.height + this.settings.v_spacing)) + (yadj_next * (this.settings.height + this.settings.v_spacing)) - ((this.settings.height + this.settings.v_spacing) * 1.5) + (this.settings.height / 2));
                ctx.stroke();

                ctx.strokeStyle = this.settings.border_color;
                ctx.lineWidth = this.settings.border_width;
                if (Math.floor(j / 2) == (j / 2)) {
                    if (data.rounds[i].matches[(j / 2)].p1 != null) {
                        ctx.fillStyle = this.settings.text_color;
                        if (data.rounds[i].matches[(j / 2)].winner != null) {
                            if (data.rounds[i].matches[(j / 2)].winner == 2) {
                                ctx.fillStyle = this.settings.text_color_loss;
                            }
                        }
                        ctx.fillText(data.rounds[i].matches[(j / 2)].p1, (i * (this.settings.width + this.settings.h_spacing)) + 5, (yloc * (this.settings.height + this.settings.v_spacing)) + (yadj * (this.settings.height + this.settings.v_spacing)) - ((this.settings.height + this.settings.v_spacing) * 1.5) + ((this.settings.height / 2) - 8));
                    }
                } else {
                    if (data.rounds[i].matches[Math.floor(j / 2)].p2 != null) {
                        ctx.fillStyle = this.settings.text_color;
                        if (data.rounds[i].matches[Math.floor(j / 2)].winner != null) {
                            if (data.rounds[i].matches[Math.floor(j / 2)].winner == 1) {
                                ctx.fillStyle = this.settings.text_color_loss;
                            }
                        }
                        ctx.fillText(data.rounds[i].matches[Math.floor(j / 2)].p2, (i * (this.settings.width + this.settings.h_spacing)) + 5, (yloc * (this.settings.height + this.settings.v_spacing)) + (yadj * (this.settings.height + this.settings.v_spacing)) - ((this.settings.height + this.settings.v_spacing) * 1.5) + ((this.settings.height / 2) - 8));


                    }
                }
            }
        }


    };
})(jQuery);
