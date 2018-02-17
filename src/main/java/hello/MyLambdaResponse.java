package hello.handler;

public class MyLambdaResponse {
        String bienvenue;

        public String getBienvenue() {
            return bienvenue;
        }

        public void setBienvenue(String bienvenue) {
            this.bienvenue = bienvenue;
        }

        public MyLambdaResponse(String bienvenue) {
            this.bienvenue = bienvenue;
        }

        public MyLambdaResponse() {
        }

    }
