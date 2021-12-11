// npm install minimist
// npm install axios
// npm install path
// npm install excel4node
// npm install jsdom
// npm install pdf-lib
let minimist = require("minimist");
let fs = require("fs");
let excel4node = require("excel4node");
let path = require("path");
let jsdom = require("jsdom");
let axios = require("axios");
let pdf = require("pdf-lib");
// node project.js --url=https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415/match-results --dest="projectexcel.csv"
let args = minimist(process.argv);
let promis = axios.get(args.url);
promis.then(function(response){
let html = response.data;
let dom = new jsdom.JSDOM(html);
let document = dom.window.document;
let scorecard = document.querySelectorAll("div.match-score-block");
let matches = []; // this is a jso file
for(let i = 0;i<scorecard.length;i++){
let match = {
};
    let name = scorecard[i].querySelectorAll("p.name");
    match.t1 = name[0].textContent;
    match.t2 = name[1].textContent;
    let scores = scorecard[i].querySelectorAll("span.score");
    match.t1s = "";
    match.t2s = "";
    if(scores.length == 2){
        match.t1s = scores[0].textContent;
        match.t2s = scores[1].textContent;
    }else if(scorecard.length == 1){
        match.t1s = scores[0].textContent;
    }else{
        match.t1s = "";
        match.t2s = "";
    }
   let result = scorecard[i].querySelector("div.status-text > span");
   match.res = result.textContent;
   matches.push(match); 
}
let teams1 = JSON.stringify(matches); // now jso is converted into ans json
fs.writeFileSync("teams1.json",teams1,"utf-8");
let teams = [];
for(let i1 = 0;i1<matches.length;i1++){
   ifteamisnotpresentthenaddtheteam(matches[i1],teams);
}

for(let j = 0;j<matches.length;j++){
    AddAllMatchesInsideMatchesInsideArray(matches[j],teams);
 }
 
let teams12 = JSON.stringify(teams);
fs.writeFileSync("teams12.json",teams12,"utf-8");

let wb = new excel4node.Workbook();
for(let i = 0;i<teams.length;i++){
   let page = wb.addWorksheet(teams[i].name);
   page.cell(1,1).string("OPPONENT TEAM");
   page.cell(1,2).string("SELF SCORE");
   page.cell(1,3).string("OPP SCORE");
   page.cell(1,4).string("RESULT");
   //console.log(matches[i].t1);
  for(let j = 0;j<teams[i].Matches.length;j++){
    page.cell(j+2,1).string(teams[i].Matches[j].opponent);
    page.cell(j+2,2).string(teams[i].Matches[j].selfscore);
    page.cell(j+2,3).string(teams[i].Matches[j].oppscore);
    page.cell(j+2,4).string(teams[i].Matches[j].result);
  }
   
}
wb.write(args.dest);




})


function ifteamisnotpresentthenaddtheteam(matches,teams){
    let index = -1;
    for(let i = 0;i<teams.length;i++){
        if(teams[i].name == matches.t1){
            index = i;
            break;
        }
    }
    if(index == -1){
       let cricketteam = {
        name : matches.t1,
        Matches : []
       }
       teams.push(cricketteam);
    }

    let index2 = -1;
    for(let i = 0;i<teams.length;i++){
        if(teams[i].name == matches.t2){
            index2 = i;
            break;
        }
    }
    if(index2 == -1){
       let cricketteam = {
        name : matches.t2,
        Matches : []
       }
       teams.push(cricketteam);
    }
    

}

function  AddAllMatchesInsideMatchesInsideArray(matches,teams){
    let index = -1;
    for(let i = 0;i<teams.length;i++){
        if(matches.t1 == teams[i].name){
            index = i;
            break;
        }
    }
    if(index != -1){
        let body = {
            opponent : matches.t2,
            selfscore : matches.t1s,
            oppscore : matches.t2s,
            result : matches.res
        }
        teams[index].Matches.push(body);
    }
    index = -1;
    for(let i = 0;i<teams.length;i++){
        if(matches.t2 == teams[i].name){
            index = i;
            break;
        }
    }
    if(index != -1){
        let body = {
            opponent : matches.t1,
            selfscore : matches.t1s,
            oppscore : matches.t2s,
            result : matches.res
        }
        teams[index].Matches.push(body);
    }


}
// node project.js --url=https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415/match-results --dest="projectexcel.csv" --folder="matches"