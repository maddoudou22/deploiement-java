package hello.handler;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.LambdaLogger;

public class LambdaMethodHandler implements RequestHandler<MyLambdaRequest, MyLambdaResponse> {
 
    @Override
    public MyLambdaResponse handleRequest(MyLambdaRequest request, Context context) {

        LambdaLogger log = context.getLogger();
        log.log("Log de Greeting");

        String bienvenue = String.format("Bienvenu %s, %s", request.prenom, request.nom);

        return new MyLambdaResponse(bienvenue);
    }
}
