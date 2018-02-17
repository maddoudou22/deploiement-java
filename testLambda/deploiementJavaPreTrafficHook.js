'use strict';

var AWS = require('aws-sdk');
const codedeploy = new AWS.CodeDeploy({apiVersion: '2014-10-06'});
AWS.config.update({region: 'REGION'});

exports.handler = (event, context, callback) => {
    console.log(JSON.stringify(event));
    
    // Preparation des attributs requis pour Codedeploy :
    //Read the DeploymentId from the event payload.
    var deploymentId = event.DeploymentId;
	console.log(deploymentId);
    //Read the LifecycleEventHookExecutionId from the event payload
	var lifecycleEventHookExecutionId = event.LifecycleEventHookExecutionId;
    console.log(lifecycleEventHookExecutionId);
    
    // Preparation des variables pour le test :
    var lambda = new AWS.Lambda({region: 'eu-west-1', apiVersion: '2015-03-31'});
    var targetFunctionArn;
    var responseFromTargetFunction;
    var stringTestInput;
    var stringTestExpected;
    var resultatFinal;
    // Nom de la fonction a tester :
    var targetFunctionName = "javaAPI-AWScodepipeline-l-javaAPIAWScodepipelineDe-14VMCRMEQ6Z39";
    // La version a tester (recuperation de la variable d'environnement passee par le template CFN pour la creation de cette fonction) :
    var targetVersion = process.env.CurrentVersion;
    console.log("variable CurrentVersion : " + targetVersion);
    // Le nom du fichier contenant le test a passer (dans le meme repertoire que cette fonction node.js) :
    var fileTestInput = "./test-input.json";
    // Le nom du fichier contenant le resultat du test attendu (dans le meme repertoire que cette fonction node.js) :
    var fileTestExpected = "./test-expectedResult.json";

    // Recuperation du test a passer :
    stringTestInput = recupFichier(fileTestInput);
    
    // Recuperation du resultat de test attendu :
    stringTestExpected = recupFichier(fileTestExpected);
    
        // Invocation de la fonction a tester avec la chaine de test :
        invoquefonctionCible(lambda, targetVersion, stringTestInput, function(responseFromTargetFunction){
            console.log("responseFromTargetFunction : ", responseFromTargetFunction);
            console.log("stringTestExpected : ", stringTestExpected);
            // Comparaison de la reponse de la fonction avec le resultat de test attendu :
            if (responseFromTargetFunction.trim() == stringTestExpected.trim()) resultatFinal = 'Succeeded';
            else resultatFinal = 'Failed';
            
            console.log("status retourne a CodeDeploy : " + resultatFinal);
            // Prepare the validation test results with the deploymentId and
            // the lifecycleEventHookExecutionId for AWS CodeDeploy.
            var params = {
                    deploymentId: deploymentId,
                lifecycleEventHookExecutionId: lifecycleEventHookExecutionId,
                status: resultatFinal // status can be 'Succeeded' or 'Failed'
            };
            
            // Pass AWS CodeDeploy the prepared validation test results.
            codedeploy.putLifecycleEventHookExecutionStatus(params, function(err, data) {
                if (err) {
		        	// Validation failed.
		        	console.log('Validation test failed');
		        	console.log(err);
		        	console.log(data);
                    callback('Validation test failed');
                } else {
		        	// Validation succeeded.
		        	console.log('Validation test succeeded');
                    callback(null, 'Validation test succeeded');
                }
            });
        });
};

function recupFichier(nomFichier) {
    var fs = require('fs');
    //var exec = require('child_process').exec;
    //var stringFichier;
    //stringFichier = fs.readFileSync(nomFichier, 'utf8');
    //console.log("apres : " + stringFichier);
    return fs.readFileSync(nomFichier, 'utf8');
}

function invoquefonctionCible(lambda, targetFunctionArn, stringTestInput, callback) {
      var pullParams = {
      FunctionName : targetFunctionArn,
      InvocationType : 'RequestResponse',
      LogType : 'None',
      Payload : stringTestInput
    };

    lambda.invoke(pullParams, function(err, data) {
         if (err) console.log(err, err.stack);
         else {
            callback(data.Payload);
         }
    });
}
