import { Injectable } from '@angular/core';

@Injectable()
export class ConverterService {

  constructor() { }


  b64toBlob(b64Data, sliceSize): Blob {
    // contentType = contentType || '';
    sliceSize = sliceSize || 512;

    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    // construct file byteArrays from byteCharacters
    let slice;
    let byteNumbers;
    let byteArray;
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      // get the curent slice of byteCharacters
      slice = byteCharacters.slice(offset, offset + sliceSize);
      // store curent slice in a byteNumber array
      byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
      }
      // convert from byteNumbers to a byteArray
      byteArray = new Uint8Array(byteNumbers);
      // store the byteArray into a byteArrays
      byteArrays.push(byteArray);
    }

    // create a blob out of byteArrays
    return new Blob(byteArrays); // , {type: contentType})
  }

  blobToFile (theBlob: any, fileName: string): File {
    // A Blob() is almost a File() - it's just missing the two properties below which we will add
     theBlob.lastModifiedDate = new Date();
     theBlob.name = fileName;
    // Cast to a File() type
    return <File>theBlob;
  }




}
