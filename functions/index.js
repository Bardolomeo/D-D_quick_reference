import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import showdown from "showdown";
import serverless from 'serverless-http';
import { dirname } from 'path';
import { fileURLToPath } from "url";
import ServerlessHttp from "serverless-http";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
const myHeaders = new Headers();
showdown.setOption('tables', true);
var converter = new showdown.Converter();
myHeaders.append("Accept", "application/json");


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.get('/', async (req, res) => {
	try{
		var response = await axios.get("https://www.dnd5eapi.co/api/rule-sections", myHeaders);
		var result = response.data.results;
		res.render("index.ejs", {rules : result});
	} catch (error) {
		console.log(error);
		res.render("index.ejs");
	}
})

app.post("/rule", async (req, res) => {
	try{
		const abilityUrl = req.body["url"];
		var response = await axios.get("https://www.dnd5eapi.co" + abilityUrl , myHeaders);
		var result = converter.makeHtml(response.data.desc);
		res.render("rule.ejs", {rule : result});
	} catch (error) {
		res.render("rule.ejs");
	}
})

app.listen(port, () => {
	console.log("listening on port " + port);
})


const handler = ServerlessHttp(app);

module.exports.handler = async (context) => {
	const result = await handler(context);
	return result;
} 
