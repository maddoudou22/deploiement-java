package hello.handler;

     public class MyLambdaRequest {
        String prenom;
        String nom;

        public String getPrenom() {
            return prenom;
        }

        public void setPrenom(String prenom) {
            this.prenom = prenom;
        }

        public String getNom() {
            return nom;
        }

        public void setNom(String nom) {
            this.nom = nom;
        }

        public MyLambdaRequest(String prenom, String nom) {
            this.prenom = prenom;
            this.nom = nom;
        }

        public MyLambdaRequest() {
        }
    }
