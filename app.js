       //We initialise the synthesiser
       const synth = new Tone.Synth().toDestination();
       Tone.start();

       allTunes = [];
       recordedNotes = [];
       isRecording = false;
       maxId = 0;
       const getAllTunes = async () => {
        //The URL to which we will send the request
        const url = 'http://localhost:3000/api/v1/tunes';

        //Perform a GET request to the url
        try {
            const response = await axios.get(url)
            //When successful, print the received data
            console.log("Success: ", response.data);
            allTunes = response.data;
            maxId = allTunes[allTunes.length-1].id;
            console.log('maxId', maxId);
            //response.data is an array if the request was successful, so you could iterate through it a forEach loop.
            response.data.forEach(item => {
                console.log("Tune name: " + item.name);
            })

            tunesdrop = document.getElementById('tunesDrop');
            console.log('tunesdrop', tunesdrop);
            document.getElementById('tunesDrop').innerHTML = '';
            tunesDrop = document.getElementById('tunesDrop');
            allTunes.forEach(tune =>{
                option = document.createElement('option');
                option.value = tune.id;
                option.textContent = tune.name;
                tunesDrop.appendChild(option);
            
        })

        }
        catch (error) {
            //When unsuccessful, print the error.
            console.log(error);
        }
        // This code is always executed, independent of whether the request succeeds or fails.
    }

    const postSongToServer = async (id, name, tune) => {
        //The URL to which we will send the request
        const url = 'http://localhost:3000/api/v1/tunes';

        //Perform a GET request to the url
        try {
            const response = await axios.post(url, {'id': id, 'name': name, 'tune': tune})
            //When successful, print the received data
            console.log("Success: ", response.data);


        }
        catch (error) {
            //When unsuccessful, print the error.
            console.log(error);
        }
        // This code is always executed, independent of whether the request succeeds or fails.
    }

       const keyMap = {
           'a': 'c4',
           'w': 'c#4',
           's': 'd4',
           'e': 'd#4',
           'd': 'e4',
           'f': 'f4',
           't': 'f#4',
           'g': 'g4',
           'y': 'g#4',
           'h': 'a4',
           'u': 'bb4', 
           'j': 'b4',
           'k': 'c5',
           'o': 'c#5',
           'l': 'd5',
           'p': 'd#5',
           ';': 'e5'
       }
   
       
       const playNote = (note, duration="8n", timing=0) =>{

        console.log('playnote ', note, duration, timing);

       
           Tone.start();
           const now = Tone.now();

           if(isRecording){
            recordedNotes.push({'note': note, 'duration': duration, 'timing':now});
           }
           //Play a C4 as an 8th note
           synth.triggerAttackRelease(note, duration, now + timing);
       }


    document.onload = getAllTunes();
   
    
    console.log(allTunes);

    const playTune = () => {
        selectedSongID = document.getElementById('tunesDrop').value;
        selectedTune = allTunes.find((element) => element.id == selectedSongID);
        selectedTune.tune.forEach(note => {
            console.log('notenote', note.note)
            playNote(note.note, note.duration, note.timing);
        });
    
    }

    const startRecording = () => {
        document.getElementById('stopbtn').disabled = false;
        recordedNotes = [];
        isRecording = true;
        
    }

    const stopRecording = () => {
        document.getElementById('stopbtn').disabled = true;
        isRecording = false;
        songName = 'No-name Tune';
        songNameInput = document.getElementById('recordName').value;
        if(songNameInput != ''){
            songName = songNameInput
        }
        postSongToServer(maxId, songName, recordedNotes);       
        getAllTunes();
       
    }


       document.addEventListener('keyup', (event) => {

           if(document.activeElement.id != 'recordName'){
            const note = keyMap[event.key];
            if(note){
                playNote(note);
            }
           }
         
       })