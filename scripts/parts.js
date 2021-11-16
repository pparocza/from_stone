class Piece {
    
    constructor(){

    }

    initMasterChannel(){

        this.globalNow = 0;

        this.gain = audioCtx.createGain();
        this.gain.gain.value = 0.5;

        this.hp = new MyBiquad( 'highpass' , 10 , 1 );
    
        this.fadeFilter = new FilterFade(0);
    
        this.masterGain = audioCtx.createGain();
        this.masterGain.connect( this.hp.input );
        this.hp.connect( this.gain );
        this.gain.connect( this.fadeFilter.input );
        this.fadeFilter.connect( audioCtx.destination );

        this.globalNoise = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.globalNoise.noise().fill( 0 );
        this.globalNoise.playbackRate = 0.25;
        this.globalNoise.loop = true;
        this.globalNoise.output.gain.value = 0.1;

    }

    initFXChannels(){

        // REVERB

            this.reverbSend = new MyGain( 1 );

            this.c = new MyConvolver();
            this.cB = new MyBuffer2( 2 , 2 , audioCtx.sampleRate );
            this.cB.noise().fill( 0 );
            this.cB.noise().fill( 1 );
            this.cB.ramp( 0 , 1 , 0.01 , 0.015 , 0.1 , 4 ).multiply( 0 );
            this.cB.ramp( 0 , 1 , 0.01 , 0.015 , 0.1 , 4 ).multiply( 1 );
            this.c.output.gain.value = 1;

            this.c.setBuffer( this.cB.buffer );

            this.reverbSend.connect( this.c );
            this.c.connect( this.masterGain );

    }

    load(){

        this.loadRampingConvolvers();

    }

    loadRampingConvolvers(){

        const fund = 1 * randomFloat( 225 , 325 ); // 300
        const iArray1 = [ 1 , M2 , P4 , P5 , M6 ];
        const iArray2 = [ 1 , M3 , P5 , 1/M2 , M6 ];
        this.gainVal = 1;
        this.globalRate = 0.25;

        const iArray = iArray1;

        // RAMPING CONVOLVER 1

        this.rC1 = new RampingConvolver( this );
        this.rC2 = new RampingConvolver( this );
        this.rC3 = new RampingConvolver( this );
        this.rC4 = new RampingConvolver( this );
        this.rC5 = new RampingConvolver( this );
        this.rC5B = new RampingConvolver( this );

        this.rC1.load( 
            // fund
            fund , 
            // bufferLength
            1 , 
            // intervalArray
            iArray , 
            // octaveArray
            [ 1 ] ,
            // cFreq 
            1000 , 
            // bandwidth
            100 , 
            // Q
            1 , 
            // oscillationRate
            randomFloat( 0.2 , 0.4 ) , 
            // noiseRate
            0.25 , 
            // gain
            this.gainVal * 1
        );

        this.rC3.load(
            // fund
            fund , 
            // bufferLength
            0.25 , 
            // intervalArray
            iArray , 
            // octaveArray
            [ 1 , 0.5 , 2 , 0.25 , 4 ] ,
            // cFreq 
            12000 , 
            // bandwidth
            11700 , 
            // Q
            5 , 
            // oscillationRate
            randomFloat( 0.2 , 0.4 ) , 
            // noiseRate
            0.25 , 
            // gain
            this.gainVal * 4
        );

        this.rC5.load(
            // fund
            fund * 2 ,  
            // bufferLength
            1, 
            // intervalArray
            iArray , 
            // octaveArray
            [ 1 , 2 , 4 ] ,
            // cFreq 
            12000 , 
            // bandwidth
            11700 , 
            // Q
            5 ,   
            // oscillationRate
            randomFloat( 0.2 , 0.4 ) ,  
            // noiseRate
            0.25 , 
            // gain
            this.gainVal * 1 
        );

        this.rC5B.load(
            // fund
            fund * 2 , 
            // bufferLength
            1, 
            // intervalArray
            iArray , 
            // octaveArray
            [ 0.25 , 0.5 ] ,
            // cFreq 
            12000 , 
            // bandwidth
            11700 , 
            // Q
            5 ,   
            // oscillationRate
            randomFloat( 0.2 , 0.4 ) ,  
            // noiseRate
            0.25 , 
            // gain
            this.gainVal * 2
        );

        this.rC2.load( 
            // fund
            fund , 
            // bufferLength
            1 , 
            // intervalArray
            iArray , 
            // octaveArray
            [ 1 , 0.5 , 2 , 0.25 , 4 ] ,
            // cFreq 
            12000 , 
            // bandwidth
            11700 , 
            // Q
            5 , 
            // oscillationRate
            randomFloat( 0.2 , 0.4 ) , 
            // noiseRate
            0.25 , 
            // gain
            this.gainVal * 4 
        )

        this.rC4.load(
            // fund
            fund , 
            // bufferLength
            2 , 
            // intervalArray
            iArray , 
            // octaveArray
            [ 1 , 0.5 , 2 , 0.25 , 4 ] ,
            // cFreq 
            12000 , 
            // bandwidth
            11700 , 
            // Q
            5 , 
            // oscillationRate
            randomFloat( 0.2 , 0.4 ) * 0.5 , 
            // noiseRate
            0.25 , 
            // gain
            this.gainVal * 4 
        );

        this.rC1.output.connect( this.masterGain );
        this.rC2.output.connect( this.masterGain );
        this.rC3.output.connect( this.masterGain );
        this.rC4.output.connect( this.masterGain );
        this.rC5.output.connect( this.masterGain );
        this.rC5B.output.connect( this.masterGain );

        // RAMPING CONVOLVER 2

        this.rC1A = new RampingConvolver2( this );

        this.rC1A.load( 
            // fund
            fund * 1 , 
            // bufferLength
            1 , 
            // intervalArray
            iArray , 
            // octaveArray
            [ 1 , 0.5 , 2 , 0.25 , 4 ] ,
            // cFreq 
            12000 , 
            // bandwidth
            11700 , 
            // Q
            5 , 
            // fmCFreq , fmMFreq
            randomInt( 1 , 10 ) , randomInt( 1 , 10 ) ,  
            // oscillationRate
            0.0625 , 
            // noiseRate
            0.25 , 
            // gain
            this.gainVal * 8
        );

        this.rC1A.output.connect( this.masterGain );

    }

    startRampingConvolvers(){

        this.phraseLength = 1 / Math.abs( this.globalRate );
        this.end = this.globalNow + this.phraseLength * 8; // 40

        // this.globalNow + this.phraseLength * 0
        // this.globalNow + this.phraseLength * 2
        // this.globalNow + this.phraseLength * 4
        // this.globalNow + this.phraseLength * 6
        // this.globalNow + this.phraseLength * 8

        // RESTORE CONVOLVER AND REVERB FADES IN START AS WELL (or just add to start arguments)

        this.rC1.start( this.globalNow + this.phraseLength * 0 , this.end );
        this.rC3.start( this.globalNow + this.phraseLength * 0 , this.end );
        this.rC5.start( this.globalNow + this.phraseLength * 0 , this.end );
        this.rC5B.start( this.globalNow + this.phraseLength * 0 , this.end );
        // this.rC2.start( this.globalNow + this.phraseLength * 6 , this.end );
        // this.rC4.start( this.globalNow + this.phraseLength * 8 , this.end );

        // this.rC1A.start( this.globalNow + this.phraseLength * 6 , this.globalNow + this.phraseLength * 40 );
    
    }

    start(){

        this.fadeFilter.start(1, 50);
		this.globalNow = audioCtx.currentTime;

        this.globalNoise.start();

        this.startRampingConvolvers();

    }

    stop() {

        this.fadeFilter.start(0, 20);
        startButton.innerHTML = "reset";

    }

}

class RampingConvolver extends Piece{

    constructor( piece ){

        super();

        this.output = new MyGain( 1 );
        this.cG = new MyGain( 0 );
        this.tGMG = new MyGain( 1 );
        this.tGRG = new MyGain( 0 );


        this.cG.connect( piece.reverbSend );
        this.cG.connect( piece.masterGain );

        this.tGMG.connect( piece.masterGain );

        this.tGMG.connect( this.tGRG );
        this.tGRG.connect( piece.reverbSend );

    }

    load( fund , bufferLength , iArray , oArray , centerFrequency , bandwidth , Q , oscillationRate , noiseRate , gainVal ){

        this.c = new MyConvolver();
        this.cB = new MyBuffer2(  1 , bufferLength , audioCtx.sampleRate );
        this.cAB = new MyBuffer2( 1 , bufferLength , audioCtx.sampleRate );

        this.oscillationRate = oscillationRate;

        let interval = 0;
        let o = 0;
        let p = 0;

        for( let i = 0 ; i < 20 ; i++ ){

            interval = randomArrayValue( iArray );
            o = randomArrayValue( oArray );
            p = randomFloat( 0.1 , 0.9 );

            this.cAB.fm( fund * interval * o , fund * interval * o , randomFloat( 0.25 , 0.5 ) ).add( 0 );
            this.cAB.constant( 1 / o ).multiply( 0 );
            this.cAB.ramp( p , p + 0.1 , 0.5 , 0.5 , 0.1 , 0.1 ).multiply( 0 );

            this.cB.addBuffer( this.cAB.buffer );

        }

        this.cB.normalize( -1 , 1 );

        // IMPULSE

            this.nF = new MyBiquad( 'bandpass' , centerFrequency , Q );

            this.nDivs = randomInt( 5 , 5 );
            this.tBDivs = randomInt( 10 , 20 );

            this.nO = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
            this.nO.playbackRate = ( this.nO.buffer.duration * this.oscillationRate ) / this.nDivs ;

            this.p = randomFloat( 0 , 1 );

            this.sB = new MyBuffer2( 1 , this.nO.buffer.duration / this.nDivs , audioCtx.sampleRate );
            this.tB = new MyBuffer2( 1 , this.sB.buffer.duration / this.tBDivs , audioCtx.sampleRate );
            this.iB = new MyBuffer2( 1 , this.nO.buffer.duration , audioCtx.sampleRate );
            this.iB.noise().fill( 0 );
            this.iB.ramp( 0 , 1 , this.p , this.p , 1 , 1 ).multiply( 0 );
            this.iB.playbackRate = randomFloat( 0.2 , 0.4 );
            this.iB.loop = true;

            this.tapBuffer = new MyBuffer2( 1 , this.iB.buffer.duration , audioCtx.sampleRate );
            this.tapAddBuffer = new MyBuffer2( 1 , this.iB.buffer.duration / 20 , audioCtx.sampleRate );

            this.tapBuffer.playbackRate = randomFloat( 0.1 , 0.2 );
            this.tapBuffer.loop = true;

            this.p2 = 0;

            for( let i = 0 ; i < 20 ; i++ ){

                this.p2 = randomFloat( 0 , 1 );
                this.tapAddBuffer.ramp( 0 , this.p2 , 0.5 , 0.5 , 0.1 , 0.1  ).fill( 0 );
                this.tapAddBuffer.constant( randomInt( 0 , 2 ) ).multiply( 0 );
                this.tapBuffer.bufferShape( this.tapAddBuffer.buffer ).insert( 0 , ( i / 20 ) , ( i + 1 ) / ( 20 ) );

            }

            console.log( 'tap buffer: ' );
            bufferGraph( this.tapBuffer.buffer );

            let r = 0;
            let rP = 0;
            let rA = 0;
            let rOD = 0;
            let rO = 0;

            for( let i = 0 ; i < this.nDivs ; i++ ){
                
                r = randomInt( 0 ,  5 );

                this.sB.constant( 0 ).fill( 0 );

                if( r === 0 ){
                    this.sB.sine( randomInt( 1 , 5 ) , 1 ).fill( 0 );
                }

                if( r === 1 ){
                    this.sB.fm( randomFloat( 0.5 , 5 ) , randomFloat( 0.5 , 5 ) , randomFloat( 0.25 , 2 ) ).fill( 0 );
                }

                if( r === 2 ){
                    this.sB.am( randomFloat( 0.5 , 5 ) , randomFloat( 0.5 , 5 ) , 1 ).fill( 0 );
                }

                if( r === 3 ){
                    rP = randomFloat( 0 , 1 );
                    this.sB.ramp( 0 , 1 , rP , rP , randomFloat( 1 , 2 ) , randomFloat( 1 , 2 ) ).fill( 0 );
                    this.sB.constant( randomArrayValue( [ -1 , 1 ] ) ).multiply( 0 );
                }

                if( r === 4){
                    for( let j = 0 ; j < this.tBDivs ; j++ ){
                        this.tB.constant( randomFloat( -1 , 1 ) ).fill( 0 );
                        this.sB.bufferShape( this.tB.buffer ).insert( 0 , j / this.tBDivs , ( j + 1 ) / this.tBDivs );
                    }
                }

                this.nO.bufferShape( this.sB.buffer ).insert( 0 , ( i / this.nDivs ) , ( ( i + 1 ) / this.nDivs ) );

            }

            this.iB.bufferShape( this.nO.buffer ).multiply( 0 );

            this.c.setBuffer( this.cB.buffer );

            console.log( 'impulse buffer: ' );
            bufferGraph( this.iB.buffer );
            console.log( 'noise oscillator buffer: ' );
            bufferGraph( this.nO.buffer );
            console.log( 'convolver buffer: ' );
            bufferGraph( this.cB.buffer );

            this.tG = new MyGain( 0 );
            this.tapBuffer.connect( this.tG.gain.gain );

            this.nOG = new MyGain( bandwidth );

            this.nO.connect( this.nOG );
            this.nOG.connect( this.nF.biquad.frequency );

            this.lp = new MyBiquad( 'lowpass' , 10 , 1 );

            this.iB.connect( this.tG );
            this.tG.connect( this.nF );
            this.nF.connect( this.c );

            this.tGG = new MyGain( 0.1 );

        // DELAY

            this.dLO = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
            this.dLO.unipolarNoise().fill( 0 );
            this.dLO.constant( 0.125 * 0.125 ).multiply( 0 );
            this.dLO.playbackRate = 0.0000125;
            this.dLO.loop = true;
            this.dLO.start();

            this.dRO = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
            this.dRO.unipolarNoise().fill( 0 );
            this.dRO.constant( 0.125 * 0.2 ).multiply( 0 );
            this.dRO.playbackRate = 0.00003;
            this.dRO.loop = true;
            this.dRO.start();

            this.d = new Effect();
            this.d.randomEcho();
            this.d.on();

            this.dLO.connect( this.d.dly.delayL.delayTime );
            this.dRO.connect( this.d.dly.delayR.delayTime );

        // WAVESHAPER

            this.s = new MyWaveShaper();
            this.s.makeSigmoid( 3 );

        // CONNECTIONS

            this.cG.connect( this.d );
            this.d.connect( this.output );

            this.c.connect( this.cG );
            this.cG.connect( this.s );
            this.s.connect( this.output );

            this.nF.connect( this.tGG );
            this.tGG.connect( this.tGMG );

            this.c.output.gain.value = gainVal;

    }

    start( startTime , stopTime ){

        let t = startTime;
        let startPoint = 0;
        let duration = 1 / this.oscillationRate;
        let divPosition = 0;
        let tBStartPoint = 0;
        let t2 = startTime;
        let duration2 = 0;

        while( t < stopTime ){

            divPosition = ( randomInt( 0 , this.nDivs ) / this.nDivs );

            startPoint = this.nO.buffer.duration * divPosition;

            this.nO.startAtTime( t , startPoint ,  duration );

            t += duration;

        }

        while( t2 < stopTime ){

            tBStartPoint = randomFloat( 0 , this.tapBuffer.buffer.duration );
            duration2 = this.tapBuffer.buffer.duration - ( this.tapBuffer.buffer.duration * tBStartPoint );

            this.tapBuffer.startAtTime( t2 , tBStartPoint , duration2 );

            t2 += duration2;

        }

        this.iB.start();

        // CG start - 20
        // TG start - 30
        this.cG.gain.gain.setTargetAtTime( 4 , startTime + 0 , 30 );
        this.tGRG.gain.gain.setTargetAtTime( 1 , startTime + 0 , 30 );

    }

}

class RampingConvolver2 extends Piece{

    constructor( piece ){

        super();

        this.output = new MyGain( 1 );

        this.output.connect( piece.masterGain );
        this.output.connect( piece.reverbSend );

    }

    load( fund , bufferLength , iArray , oArray , centerFrequency , bandwidth , Q , fmCFreq , fmMFreq , oscillationRate , noiseRate , gainVal ){

        this.c = new MyConvolver();
        this.cB = new MyBuffer2(  1 , bufferLength , audioCtx.sampleRate );
        this.cAB = new MyBuffer2( 1 , bufferLength , audioCtx.sampleRate );

        this.oscillationRate = oscillationRate;

        let interval = 0;
        let o = 0;
        let p = 0;

        for( let i = 0 ; i < 20 ; i++ ){

            interval = randomArrayValue( iArray );
            o = randomArrayValue( oArray );
            p = randomFloat( 0.1 , 0.9 );

            this.cAB.fm( fund * interval * o , fund * interval * o , randomFloat( 0.25 , 0.5 ) ).add( 0 );
            this.cAB.constant( 1 / o ).multiply( 0 );
            this.cAB.ramp( p , p + 0.1 , 0.5 , 0.5 , 0.1 , 0.1 ).multiply( 0 );

            this.cB.addBuffer( this.cAB.buffer );

        }

        this.cB.normalize( -1 , 1 );

        bufferGraph( this.cB.buffer );

        this.c.setBuffer( this.cB.buffer );

        // NOISE

            this.globalNoiseGain = new MyGain( 0 );

            this.nF = new MyBiquad( 'bandpass' , centerFrequency , Q );

            this.nDivs = randomInt( 5 , 15 );
            this.tBDivs = randomInt( 10 , 20 );

            this.nO = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
            this.nO.playbackRate = ( this.nO.buffer.duration * this.oscillationRate ) / this.nDivs ;

            this.sB = new MyBuffer2( 1 , this.nO.buffer.duration / this.nDivs , audioCtx.sampleRate );
            this.tB = new MyBuffer2( 1 , this.sB.buffer.duration / this.tBDivs , audioCtx.sampleRate );

            let r = 0;
            let rP = 0;
            let rA = 0;
            let rOD = 0;
            let rO = 0;

            for( let i = 0 ; i < this.nDivs ; i++ ){
                
                r = randomInt( 0 ,  5 );

                this.sB.constant( 0 ).fill( 0 );

                if( r === 0 ){
                    this.sB.sine( randomInt( 1 , 5 ) , 1 ).fill( 0 );
                }

                if( r === 1 ){
                    this.sB.fm( randomFloat( 0.5 , 5 ) , randomFloat( 0.5 , 5 ) , randomFloat( 0.25 , 2 ) ).fill( 0 );
                }

                if( r === 2 ){
                    this.sB.am( randomFloat( 0.5 , 5 ) , randomFloat( 0.5 , 5 ) , 1 ).fill( 0 );
                }

                if( r === 3 ){
                    rP = randomFloat( 0 , 1 );
                    this.sB.ramp( 0 , 1 , rP , rP , randomFloat( 1 , 2 ) , randomFloat( 1 , 2 ) ).fill( 0 );
                    this.sB.constant( randomArrayValue( [ -1 , 1 ] ) ).multiply( 0 );
                }

                if( r === 4){
                    for( let j = 0 ; j < this.tBDivs ; j++ ){
                        this.tB.constant( randomFloat( -1 , 1 ) ).fill( 0 );
                        this.sB.bufferShape( this.tB.buffer ).insert( 0 , j / this.tBDivs , ( j + 1 ) / this.tBDivs );
                    }
                }

                this.nO.bufferShape( this.sB.buffer ).insert( 0 , ( i / this.nDivs ) , ( ( i + 1 ) / this.nDivs) );

            }

            bufferGraph( this.nO.buffer );

            this.nOG = new MyGain( bandwidth );

            this.nO.connect( this.nOG );

            this.nOG.connect( this.nF.biquad.frequency );
            piece.globalNoise.connect( this.globalNoiseGain );
            this.globalNoiseGain.connect( this.nF );
            this.nF.connect( this.c );

        // DELAY

            this.dLO = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
            this.dLO.unipolarNoise().fill( 0 );
            this.dLO.constant( 0.125 * 0.125 ).multiply( 0 );
            this.dLO.playbackRate = 0.0000125;
            this.dLO.loop = true;
            this.dLO.start();

            this.dRO = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
            this.dRO.unipolarNoise().fill( 0 );
            this.dRO.constant( 0.125 * 0.2 ).multiply( 0 );
            this.dRO.playbackRate = 0.00003;
            this.dRO.loop = true;
            this.dRO.start();

            this.d = new Effect();
            this.d.randomEcho();
            this.d.on();

            this.dLO.connect( this.d.dly.delayL.delayTime );
            this.dRO.connect( this.d.dly.delayR.delayTime );

        // CONNECTIONS

            this.c.connect( this.d );

            this.c.connect( this.output );
            this.d.connect( this.output );

            this.c.output.gain.value = gainVal;

    }

    start( startTime , stopTime ){

        let t = startTime;
        let startPoint = 0;
        let duration = 1 / this.oscillationRate;
        let divPosition = 0;

        while( t < stopTime ){

            divPosition = ( randomInt( 0 , this.nDivs ) / this.nDivs );

            startPoint = this.nO.buffer.duration * divPosition /*+ randomFloat( 0 , 0.9 )*/;

            this.nO.startAtTime( t , startPoint ,  duration ); 

            t += duration;

        }

        this.globalNoiseGain.gain.gain.setTargetAtTime( 1 , startTime , 0.01 );
        this.globalNoiseGain.gain.gain.setTargetAtTime( 0 , stopTime , 0.01 );

    }

}