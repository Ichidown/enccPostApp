import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorIdentifierService {

  constructor() { }

  public getErrorMessage(errorCode): String {
    switch (errorCode) {
      case 'E-100' : return 'utilisateur inconnus';
      case 'E-321' : return 'échec d execution de la requéte';
      case 'E-300' : return 'liste vide';
      case 'E-532' : return 'erreur de traitement de fichier';
      case 'E-400' : return 'erreur lors de la génération du nom du fichier ou del image';
      case 'E-200' : return 'erreur lors du renommage ou du déplacement de fichiers';
      case 'E-500' : return 'base de données hors ligne';
      case 'E-550' : return 'echec de suppression';
      case 'E-444' : return 'fichier introuvable';

      case 'E-600' : return 'image trop large';
      case 'E-601' : return 'fichier trop large';
      case 'E-700' : return 'echec d envoi du fichier';
      case 'E-701' : return 'echec de creation';

      case 'E-800' : return 'formulaire invalide';
      case 'E-810' : return 'image ou fichier non choisie';

      case 'E-900' : return 'formulaire invalide ou incomplèt';

      default :  return 'erreur inconu : ' + errorCode;
    }

  }
}
