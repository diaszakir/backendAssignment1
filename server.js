const http = require('http');
const express = require('express');
const chalk = require('chalk');
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.post('/calculate', (req,res) => {
    const {gender, age, weight, height} = req.body;
    if (age < 12 || age > 140 || weight < 5 || height < 0.5 || weight > 500 || height > 2.5) {
        return res.send(`
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8"/>
                    <meta name = "viewport" content="width=device-width, initial-scale=1.0"/>
                    <title>Error</title>
                    <link rel="stylesheet" href="/style.css">
                </head>
                <body>
                    <div class="choose">
                        <h1>BMI Calculator</h1>
                        <h1>Error: Type correct data for weight, height and age (12+)</h1>
                        <a href = '/'>Return</a>
                    </div>    
                </body>
            </html>
        `)
    }
    else {
        let bmi = weight / (height * height);
        let category = '';
        let tip = '';
        let k;
        let k_adult = 1;
        let ageMessage = '';

        if(gender === 'male') {
            k = 1.05;
            bmi *= k;
        } else if (gender === 'female') {
            k = 0.95;
            bmi *= k;
        }

        if (age < 18) {
            k_adult = 0.9;
            bmi *= k_adult;
            ageMessage = 'Less 18, result can be incorrect';
        }

        if (bmi < 18.5) {
            category = 'Underweight';
            tip = "It's not okay, you should visit doctor immediately.";
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            category = 'Normal weight';
            tip = "Everything okay, don't worry";
        } else if (bmi >= 25 && bmi <= 29.9) {
            category = 'Overweight';
            tip = "It's not okay, you should take diet"
        } else if (bmi >= 30) {
            category = 'Obesity';
            tip = "Danger! Go to the hospital!"
        }

        res.send(`
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8"/>
                <meta name = "viewport" content="width=device-width, initial-scale=1.0"/>
                <title>BMI Calculator</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>
                    <h1>BMI Calculator</h1>
                <div class="choose">    
                    <h1>Characteristics: </h1>
                    <p>Your gender: ${gender}</p>
                    <p>Your BMI: ${bmi}</p>
                    <p>Your age: ${age}</p>
                    <p>Your weight: ${weight}</p>
                    <p>Your height: ${height}</p>
                    <h2>Result: ${category}</h2>
                    <h2>Tip:</h2>
                    <p>${tip}</p>
                    
                    <a href="/">Return</a>
                </div>
            </body>
        </html>`)
    }
})


const PORT = 3000;
app.listen(PORT, () => {
    console.log(chalk.green(`Server is running on port: http://localhost:${PORT}`));
})