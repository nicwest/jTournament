(function ($) {

    $.fn.jTournament = function (settings, data) {

		//Default Options
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
			gradient: false,
			logo: {active: false, height: 30, width: 30, default_image: "default_logo.jpg", border: 1},
			score: {active: false, height: 30, width: 10, score_win_color: "#0000FF",score_loss_color: "#FF0000",score_neutral_color: "#00FF00"}
		};
		
		$.extend(true,ds, settings);
		this.settings = ds;
		this.rounds = data.rounds.length;
		this.players = (data.rounds[0].matches.length * 2);
		if (this.settings.logo.active) {
		 		this.settings.width = this.settings.width+this.settings.logo.width;
		 		if (this.settings.height < this.settings.logo.height){
		 			this.settings.height = this.settings.logo.height;
		 		}
		 }
		 if (this.settings.score.active) {
		 		this.settings.width = this.settings.width+this.settings.score.width;
		 		if (this.settings.height < this.settings.score.height){
		 			this.settings.height = this.settings.score.height;
		 		}
		 }
		//adjust canvas size to the right size.
		this.attr('height', this.players * (this.settings.height + this.settings.v_spacing));
		this.attr('width', this.rounds * (this.settings.width + this.settings.h_spacing + this.settings.width));
		var logo_store = [];
		//Check to see if browser will use canvas
		if (this[0].getContext) {
			var ctx = this[0].getContext('2d');
		} else {
			//shout at them for failski bowser choice
			alert("Your Browser Fails, please download something from the 21st century");
		}
		//function for making gradients in_var is the top
		//positition of the element you are filling
		function makegrad(in_var, settings) {
			if (settings.gradient) {
				var gradient2 = ctx.createLinearGradient(0, in_var, 0, in_var + settings.height);
				for (k = 0; k < settings.gradient.length; k++) {
					gradient2.addColorStop(settings.gradient[k].loc, settings.gradient[k].color);
				}

				return (gradient2);
			} else {
				//otherwise return fill if no gradient is needed
				return (settings.background_color);
			}
		}

		 
		// i = rounds, j = players in matches in that round
		for (i = 0; i < (this.rounds); i++) {
				for (j = 0; j < (data.rounds[i].matches.length * 2); j++) {
			   //set up general defaults accoring to settings
			   ctx.fillStyle = this.settings.background_color;
			   ctx.strokeStyle = this.settings.border_color; // red
			   ctx.lineWidth = this.settings.border_width;
			   ctx.font = this.settings.text_style;
			   ctx.textBaseline = 'top';
			   //general formular is (((2^i)*(j+1))+(1-(2^i))) I broke it down for my own sanitity.
			   var c = (Math.pow(2, (i)));
			   var n = j + 1;
			   var yloc = (c * n) + (1 - c);
			   var yloc_next = ((Math.pow(2, (i + 1))) * (Math.ceil((j + 1) / 2))) + (1 - (Math.pow(2, (i + 1))));
			   var ygap = ((c * (n + 1)) + (1 - c)) - yloc;
			   var yadj = ygap / 2;
			   var ygap_next = ((Math.pow(2, (i + 1))) * (Math.ceil((j + 1) / 2) + 1)) + (1 - (Math.pow(2, (i + 1)))) - yloc_next;
			   var yadj_next = ygap_next / 2;		
				var prot_y = this.settings.height + this.settings.v_spacing;
				var prot_x = this.settings.width + this.settings.h_spacing;
				var x_adjustment = 0;
				var y_adjustment = 0;
				
				if (this.settings.logo.active){
					prot_x += this.settings.logo.width;
					x_adjustment += this.settings.logo.width;
				}

				 //draw logo if active
				if (this.settings.logo.active){	
					
					logo_store[j] ={};
					logo_store[j].func = new Image();
					logo_store[j].func.settings = this.settings.logo;
					logo_store[j].func.onload = function () {
						ctx.drawImage(this, this.xpos, this.ypos)
						if (this.settings.border > 0){
							ctx.strokeRect(this.xpos+1, this.ypos, this.settings.width-1, this.settings.height);
						}
					}
					logo_store[j].func.xpos = ((i * (prot_x)));
					logo_store[j].func.ypos = (yloc * (prot_y)) + (yadj * (prot_y)) - ((prot_y) * 1.5);
					logo_store[j].func.j = j;

					if (Math.floor(j / 2) == (j / 2)){
						if (data.rounds[i].matches[(j / 2)].p1_logo != null) {
							logo_store[j].func.src = data.rounds[i].matches[(j / 2)].p1_logo;
						} else {
							logo_store[j].func.src = this.settings.logo.default_image;
						}
					} else {
						if (data.rounds[i].matches[Math.floor(j / 2)].p2_logo != null) {
							logo_store[j].func.src = data.rounds[i].matches[Math.floor(j / 2)].p2_logo;
						} else {
							logo_store[j].func.src = this.settings.logo.default_image;
						}
					}
				} 
				
				//This is a mess... will tidy later (vaguely tidied now)
				ctx.fillStyle = makegrad((yloc * (prot_y)) + (yadj * (prot_y)) - ((prot_y) * 1.5), this.settings);
				ctx.fillRect(((i * (prot_x))+x_adjustment), (yloc * (prot_y)) + (yadj * (prot_y)) - ((prot_y) * 1.5), this.settings.width, this.settings.height);
				
				
				//draw border if needed
				if (this.settings.border_width > 0) {
					ctx.strokeRect(((i * (prot_x))+x_adjustment), (yloc * (prot_y)) + (yadj * (prot_y)) - ((prot_y) * 1.5), this.settings.width, this.settings.height);
				}
				
				//if last round draw winner cell
				if (i == (this.rounds - 1)) {
					if (this.settings.logo.active){	
					
						logo_store[j+1] ={};
						logo_store[j+1].func = new Image();
						logo_store[j+1].func.settings = this.settings.logo;
						logo_store[j+1].func.onload = function () {
							ctx.drawImage(this, this.xpos, this.ypos)
							if (this.settings.border > 0){
								ctx.strokeRect(this.xpos+1, this.ypos, this.settings.width-1, this.settings.height);
							}
						}
						logo_store[j+1].func.xpos = (((i+1) * (prot_x)));
						logo_store[j+1].func.ypos = (yloc_next * (prot_y)) + (yadj_next * (prot_y)) - ((prot_y) * 1.5);
						

							if (data.rounds[i].matches[0].winner == 1) {
								logo_store[j+1].func.src = data.rounds[i].matches[(j / 2)].p1_logo;
							} else if (data.rounds[i].matches[0].winner == 2){
								logo_store[j+1].func.src = data.rounds[i].matches[(j / 2)].p2_logo;
							} else {
								logo_store[j+1].func.src = this.settings.logo.default_image;
							}
						
					} 
					ctx.fillStyle = makegrad((yloc_next * (prot_y)) + (yadj_next * (prot_y)) - ((prot_y) * 1.5), this.settings);
					ctx.fillRect((((i + 1) * (prot_x))+x_adjustment), (yloc_next * (prot_y)) + (yadj_next * (prot_y)) - ((prot_y) * 1.5), this.settings.width, this.settings.height);
					//draw border if needed
					if (this.settings.border_width > 0) {
						ctx.strokeRect((((i + 1) * (prot_x))+x_adjustment), (yloc_next * (prot_y)) + (yadj_next * (prot_y)) - ((prot_y) * 1.5), this.settings.width, this.settings.height);
					}
					if (data.rounds[i].matches[0].winner == 1) {
						ctx.fillStyle = this.settings.text_color;
						ctx.fillText(data.rounds[i].matches[0].p1, ((((i + 1) * (prot_x)) + 5)+x_adjustment), (yloc_next * (prot_y)) + (yadj_next * (prot_y)) - ((prot_y) * 1.5) + ((this.settings.height / 2) - 8));
					}
					if (data.rounds[i].matches[0].winner == 2) {
						ctx.fillStyle = this.settings.text_color;
						ctx.fillText(data.rounds[i].matches[0].p2, ((((i + 1) * (prot_x)) + 5)+x_adjustment), (yloc_next * (prot_y)) + (yadj_next * (prot_y)) - ((prot_y) * 1.5) + ((this.settings.height / 2) - 8));
					}
				}

				//set bracket options
				ctx.strokeStyle = this.settings.bracket_color;
				ctx.lineWidth = this.settings.bracket_width;

				//draw them brakets
				ctx.beginPath();

				//move to right middle of element just dawn
				ctx.moveTo((((i * (prot_x)) + this.settings.width)+x_adjustment), (yloc * (prot_y)) + (yadj * (prot_y)) - ((prot_y) * 1.5) + (this.settings.height / 2));

				// draw horizontal line to 1/2 of h_spacing
				ctx.lineTo((((i * (prot_x)) + this.settings.width + (this.settings.h_spacing / 2))+x_adjustment), (yloc * (prot_y)) + (yadj * (prot_y)) - ((prot_y) * 1.5) + (this.settings.height / 2));

				//draw vertical line to y of the middle of the next element
				ctx.lineTo((((i * (prot_x)) + this.settings.width + (this.settings.h_spacing / 2))+x_adjustment), (yloc_next * (prot_y)) + (yadj_next * (prot_y)) - ((prot_y) * 1.5) + (this.settings.height / 2));

				//draw horizontal to next element
				ctx.lineTo((((i * (prot_x)) + prot_x)+x_adjustment), (yloc_next * (prot_y)) + (yadj_next * (prot_y)) - ((prot_y) * 1.5) + (this.settings.height / 2));
				ctx.stroke();

				//reset strokes in case you have different borders
				ctx.strokeStyle = this.settings.border_color;
				ctx.lineWidth = this.settings.border_width;

				//evens or odds I could use mods I think but I'm only a simple bear
				if (Math.floor(j / 2) == (j / 2)) {

					//if player has a name...
					if (data.rounds[i].matches[(j / 2)].p1 != null) {

						//...set fill style to text color...
						ctx.fillStyle = this.settings.text_color;

						//...and the match has been played...
						if (data.rounds[i].matches[(j / 2)].winner != null) {

							//...and this poor fella has lost...
							if (data.rounds[i].matches[(j / 2)].winner == 2) {

								//...set the fill style to looser color...
								ctx.fillStyle = this.settings.text_color_loss;
							}
						}

						//...then write the NAME!
						ctx.fillText(data.rounds[i].matches[(j / 2)].p1, (((i * (prot_x)) + 5)+x_adjustment), (yloc * (prot_y)) + (yadj * (prot_y)) - ((prot_y) * 1.5) + ((this.settings.height / 2) - 8));
					}
				} else {

					//do the same thing for again for player two
					if (data.rounds[i].matches[Math.floor(j / 2)].p2 != null) {
						ctx.fillStyle = this.settings.text_color;
						if (data.rounds[i].matches[Math.floor(j / 2)].winner != null) {
							if (data.rounds[i].matches[Math.floor(j / 2)].winner == 1) {
								ctx.fillStyle = this.settings.text_color_loss;
							}
						}
						ctx.fillText(data.rounds[i].matches[Math.floor(j / 2)].p2, (((i * (prot_x)) + 5)+x_adjustment), (yloc * (prot_y)) + (yadj * (prot_y)) - ((prot_y) * 1.5) + ((this.settings.height / 2) - 8));


					}
				}
			}
		}


	};
})(jQuery);
