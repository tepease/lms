/*This code is intended to document the ecosystem in client facing orientation SCO, and may be used to help set up new projects in Adobe Captivate 9. 
Hopefully some day I'll get the SCO functions assigning & working exclusively from an external JS file. 
If you're reading this and you're not me, I didn't figure it out yet. 
Good luck with Captivate lol.*/





//V     A     R     I     A     B     L     E     S
//user variables
var policy# = 'n'; //# is replaced with the relevent policy ID, e.g. GNP14615. var gets y or n for reporting & button persistence on tick box slides for viewing & agreeing to policies
var quiz# = 0; //# is replaced with the relevent question number for button persistence on quiz re-entry
var walkthrough = 0; //gets 1 on exit of walkthrough slide so viewers dont have to watch it every time. could deprecate in favor of including 0 opacity buttons on slides
var slideNum = 0; //used for displaying chapter/location in top left caption
var totalSlides = 0; //used with slideNum above in caption "$$slideNum$$/$$totalSlides$$" to display progress
var failCount = 0; //subject of JS event listener that advances slide after wrong answer submitted
var failText = "";
//var qPrev = ""; //assigned cpQuizInfoAnswerChoice and subject of JS event listener that identifies when a new final answer is submitted and allows quiz buttons to function
var correctQ = 0;
var quizScore = 0;
var studentName = "";
var firstName = "";



//A     C      T     I     O     N     S
//advanced & shared actions. all shared actions have commands wrapped e.g. $command$
function onEnter() {
	slideNum = cpInfoCurrentSlide - 3; //in which 3 is the splash animation slide (1), the tutorial animation slide (2), and the TOC (3)
	totalSlides = cpInfoSlideCount - 3;
}
function walkthroughEnter() { //apply to event On Enter for walkthrough slide
	if(walkthrough == 0){
		cp.continue(); // check this - doesnt seem to be working
	} else {
		cpCmndNextSlide = 1;
	}
}
function boolSwitch() { //apply to checkBox smartshape button
	if(policy# == n){
		cp.show($window.data.x#.oca$); // object x# e.g. xGNP14615 is the smartshape X hidden under the checkbox
		policy# = y;
	} else {
		cp.hide($window.data.x#.oca$);
		policy# = n;
	}
}
function skipFpolicy() { //apply to skipF smartshape button
	if($policy#$ == 'y' && userName != "init val") { //ideally != "init val" would be replaced by == *cpInfoUserName* in which cpInfoUserName is a var that contains the moodle user's name 
		cp.hide($cp.model.data.readPolicy#.oca$);
		cpCmndGotoNextSlide();
	} else {
		cp.show($cp.model.data.readPolicy#.oca$)
	}
}
function readDoc() {
	if($policy#$ == 'y') {
		cp.hide($cp.model.data.readPolicy#.oca$);
		cp.comtinue;
	} else {
		cp.jumpToSlide($currentSlide$)
	}
}
function getName() { // assigned to walkthrough slide On Enter event for LMS version 
	if(walkthrough == 0){
    	if (typeof window.GetStudentName === 'undefined'){
    	    studentName = 'Name Not Found'; // function unavailable error
    	} else {
    	    studentName = GetStudentName();
    	    if (studentName == '') {
    	        studentName ='Name Not Found'; // name property empty error
    	    } else {
    	    	firstName = studentName.split(', ')[1]; // assign first name 
    	        studentName = studentName.split(', ')[1] + ' ' + studentName.split(', ')[0]; //rearrange name as First Last
    	    }
    	}
    	walkthrough = 1;
    } else {
    	cpCmndNextSlide = 1;
    }
}
function checkName() { // assigned to text entry slide in local only version
	if(firstName != "First Name" && lastName != "Last Name"){
		studentName = firstName + " " + lastName;
		cpCmndGotoSlide = 4;
	}
}
function policyTutorial() {
	if(policyTutorial == 0){
		policyTutorial = 1;
	} else {
		cpCmndNextSlide = 1;
	}
	slideNum = cpInfoCurrentSlide - 3;
}
function slideNumUpdate() {
	slideNum = cpInfoCurrentSlide - skipSlides; // skipSlides needs to get ++ every time a new single view slide is passed 
	totalSlides = cpInfoSlideCount - 4; // 4 = total single view slides in project, e.g. splash slide + TOC + intro animation
}
function slideNumUpdateLifeBridge() {
	slideNum = cpInfoCurrentSlide - 3;
	totalSlides = cpInfoSlideCount - 4;
	if(cpInfoCurrentSlide == 43 && !sinai){
		cpCmndNextSlide = 1;
	}
	if(cpInfoCurrentSlide == 44 && !northwest){
		cpCmndNextSlide = 1;
	}
	if(cpInfoCurrentSlide == 45 && !levindale){
		cpCmndNextSlide = 1;
	}
}
function slideNumUpdateBRANCH1() {
	slideNum = cpInfoCurrentSlide - 3;
	totalSlides = cpInfoSlideCount - 4;
	cp.executeJS(current){
		if(cpInfoCurrentSlide == 43){
			if(sinai){
				cp.continue;
			} else {
				if(northwest){
					cpCmndGoToSlideandResume(cpInfoCurrentSlide + 1);
				} else if(levindale) {
					cpCmndGoToSlideandResume(cpInfoCurrentSlide + 2);
				}
			}
		}
	}
}
function skipFBRANCH() {
	cp.executeJS(current){
		if(cpInfoCurrentSlide == 43){
			if(northwest){
				cpCmndGotoNextSlide;
			} else if(levindale){
				cpCmndGoToSlide(cpInfoCurrentSlide + 2);
			} else {
				cpCmndGoToSlideandResume(cpInfoCurrentSlide + 3);
			}
		} else if(cpInfoCurrentSlide == 44){
			if(levindale){
				cpCmndGotoNextSlide;
			} else {
				cpCmndGoToSlideandResume(cpInfoCurrentSlide + 2);
			}
		} else {
			cpCmndGotoNextSlide;
		}
	}
}
function onEnterQ#() { //would be great if this could be shared, can't use JS selections as commands in CP though, so this function must be rewritten for every. single. quiz slide until I get functions.js working
	if(true){
		cp.hide($window.data["failText" + (slideNum-1) + ".oca"]$); //this is the previous slide's failText caption - if last slide was MCQ. Else this does nothing.
		cp.hide($window.data["correct" + (slideNum-1) + ".oca"]$); //prev slide's correct caption 
	}else if(quiz# = 1){
		cp.show(window.data.next#.oca);
		cp.show(window.data.glow#.oca);
		cp.continue;
	}else{
		failCount = 0;
		cp.executeJS(current){
			failText = "You have 2 more tries.";
			function quizCounter() { 
				if(failCount > 1) {
					window.cp.runJavascript(cp.model.data.quizAdvance#.oca);
				}
			}
		}
		setInterval(quizCounter, 100);
	}
}
function quizAdvance#() { //same problem as above with duplication needs. this action allows quiz to procede once a final answer is given 
	cp.show(window.data.next#.oca);
	cp.show(window.data.glow#.oca);
	cp.continue;
	quiz# = 1;
}
function quizCorrect#() { //same problem as above with duplication needs. this action allows quiz to procede once a final answer is given 
	cp.show(window.data.correct#.oca);
	cp.show(window.data.next#.oca);
	cp.show(window.data.glow#.oca);
	cp.continue;
	cp.assign(quiz# = 1);
	cp.increment(correctQ++);
}
function quizIncorrect#() { //duplication >:|  assigned to all MCQ incorrect answers as advanced answer option
	cp.show(window.data.failText#.oca); // if question has 2 attempt, this line is first line in function, if 3 attempts, this is last line in function
	cp.executeJS{
		if(failCount == 0) {
			failText = "You have 1 more try.";
			failCount++;
		} else if(failCount == 1) { 
			failText = "Click to clear this message, then continue.";
			failCount++;
		}
	}
}





//S    L     I     D     E     S
//all layer# items are objects with type and specs as defined
var slide1_Splash = {
	layer1 : slideVideo,
	event onExit : cp.jumpToSlide(3) //index starts at 1 for cpInfoCurrentSlide - this action skips the TOC leaving it hidden until accessed with TOC button
}
var slide2_TOC = {
	layer1 : smartshape_button, //all TOC items indiv smartshape buttons w/ hoverstate = brand color and action jumpToSlide(target)
	layer2 : tocBack, //button w "go to last slide visited"
}
var slide3_Walkthrough = {
	event onEnter : walkthroughEnter(),
	layers : all //timed content showing all buttons in hover states w/ captions describing how to use them
	event onExit : {walkthrough = 1;}
}
var slide4_ContentSlides = {
	event onEnter : function slideNumUpdate() {slideNum = cpInfoCurrentSlide - 3;},
	layer1 : TOC {state_normal = text("$$slideNum$$/$$totalSlides$$"), state_hover = image(toc4.png), opacity(100), reflection(2)},
	layer2 : pdf {state_normal = opacity(0), state_hover = image(pdf4.png)}
	layer3 : back# {event this.onSuccess : cp.goToPreviousSlide(), map(left_arrow)},
	layer4 : next# {event this.onSuccess : cp.goToNextSlide(), map(right_arrow)}
	layer5 : content;
}
var slide5_reviewAndConsent = {
	event onEnter : slideNumUpdate(),
	layer1 : TOC {state_normal = text("$$slideNum$$/$$totalSlides$$"), state_hover = image(toc4.png), opacity(100), reflection(2)},
	layer2 : pdf {state_normal = opacity(0), state_hover = image(pdf4.png)}
	layer3 : back# {event this.onSuccess : cp.goToPreviousSlide(), map(left_arrow)},
	layer4 : next# {event this.onSuccess : skipFpolicy(), map(right_arrow)},
	checkBox# : smarthape_button, event onSuccess = policyCheck(), fill_opacity = 0, stroke width = 1, stroke_color = text2,
	check# : hidden, text("X"), font_family = arial, font_size = 28, font_color = brandHighlight,
	policy# : smartshape_button, event onSuccess = openUrl(target), font_align = right, font_color = brandHighlight, text = "Policy Document ADM1.1.04", //or whatever
	pdf : image = pdf1, // under left corner of policy#
	event onExit : readDoc();
}
var slide6_quiz = { //all non-MCQ question slides
	event onEnter : onEnterQ_#(), //as explained in above function call, this must be re-written for every q slide. 
	failText : smartshape_button, text = "Incorrect. $$failText$$", font_color = orange, event onSuccess = function{cp.hide(cp.model.data.failText#.oca)}, //still need to write this in but itll resolve the annoying need to click to clear incorrect remediation
	TOC : {state_normal = timing.pause_after(1), text("$$slideNum$$/$$totalSlides$$"), state_hover = image(toc4.png), opacity(100), reflection(2)},
	pdf : {state_normal = opacity(0), state_hover = image(pdf4.png)},
	next# : hidden, event onSuccess = cp.goToNextSlide(), map(right_arrow),
	glow# : timing.displayfor(1), timing.appear_after(1), timing.transition.fade_in_out(0.5, 0.5),
	back# : {event this.onSuccess : cp.goToPreviousSlide(), map(left_arrow)},
	quizAdvance# : opacity = 0, location = "under prev#", event onSuccess = quizAdvance#(),
	event quiz.onSuccess : quizAdvance#(),
	event quiz.lastAttempt : quizAdvance#(),
}
var slide6_quizMCQ = { //all MCQ question slides
	event onEnter : onEnterQ_#(), //as explained in above function call, this must be re-written for every q slide. 
	failText : smartshape_button, text = "Incorrect. $$failText$$", font_color = orange, event onSuccess = function{cp.hide(cp.model.data.failText#.oca)}, //still need to write this in but itll resolve the annoying need to click to clear incorrect remediation
	TOC : {state_normal = timing.pause_after(1), text("$$slideNum$$/$$totalSlides$$"), state_hover = image(toc4.png), opacity(100), reflection(2)},
	pdf : {state_normal = opacity(0), state_hover = image(pdf4.png)},
	next# : hidden, event onSuccess = cp.goToNextSlide(), map(right_arrow),
	glow# : timing.displayfor(1), timing.appear_after(1), timing.transition.fade_in_out(0.5, 0.5),
	back# : {event this.onSuccess : cp.goToPreviousSlide(), map(left_arrow)},
	quizAdvance# : opacity = 0, location = "under prev#", event onSuccess = quizAdvance#(),
	event correctAnswer.advancedAnswerProperty.executeAction : quizCorrect#(),
	event wrongAnswer.advancedAnswerProperty.executeAction : quizIncorrect(),
}
var slide7_results = { //quiz results slide
	TOC : {state_normal = text("$$slideNum$$/$$totalSlides$$"), state_hover = image(toc4.png), opacity(100), reflection(2)},
	pdf : {state_normal = opacity(0), state_hover = image(pdf4.png)}
	//back# : {event this.onSuccess : cp.goToPreviousSlide(), map(left_arrow)}, this aint workin. dunno why
	exit : {smartshape_button, event this.onSuccess : cp.exit(),} //same style as next, don't map toright though or users will exit by mistake
}





//P     U     B     L     I     S     H
//to finish project:
//1) publish unzipped & copy ../DEA_education/dev/fonts/ to ../assets/ 
//2) add to ../assets/css/CPLibraryAll.css: 
@font-face {
	font-family: 'Gotham';
    src: url('../fonts/Gotham/TTF/Gotham-Light.ttf') format('truetype'), url('../fonts/Gotham/WOFF/Gotham-Light.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}
@font-face {
    font-family: 'Corbel';
  	src: url('../fonts/Corbel/corbel.ttf') format('truetype'), url('../fonts/Corbel/corbel.woff') format('woff');
  	font-weight: normal;
  	font-style: normal;
}
//3) save CPLibraryAll.css
//4) zip SCORM folder contents & upload

//cheers, thanks for reading