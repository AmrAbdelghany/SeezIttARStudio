import * as THREE from 'three';

import { zipSync, strToU8 } from 'three/addons/libs/fflate.module.js';
import { AddObjectCommand } from './commands/AddObjectCommand.js';

import { UIPanel, UIRow, UIHorizontalRule } from './libs/ui.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { RemoveObjectCommand } from './commands/RemoveObjectCommand.js';

function MenubarFile( editor ) {

	const config = editor.config;
	const strings = editor.strings;

	const container = new UIPanel();
	container.setClass( 'menu' );

	const title = new UIPanel();
	title.setClass( 'title' );
	title.setTextContent( strings.getKey( 'menubar/file' ) );
	container.add( title );

	const options = new UIPanel();
	options.setClass( 'options' );
	container.add( options );

	// New

	let option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/new' ) );
	option.onClick( function () {

		if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) ) {

			editor.clear();

			const light1 = new THREE.DirectionalLight(0xffffff, 5.00); // white light
			light1.name = 'Light1';
			light1.position.set(0.000, 10.000, -11.500);
		
			const light2 = new THREE.DirectionalLight(0xffffff, 5.00);
			light2.name = 'Light2';
			light2.position.set(0.000, 10.000, 8.000);

			const light3 = new THREE.DirectionalLight(0xffffff, 3.00);
			light3.name = 'Light3';
			light3.position.set(0.000, -10.000, 0.000);

			const light4 = new THREE.DirectionalLight(0xffffff, 3.00);
			light4.name = 'Light4';
			light4.position.set(10.000, 0.000, 0.000);

			const light5 = new THREE.DirectionalLight(0xffffff, 3.00);
			light5.name = 'Light5';
			light5.position.set(-10.000, 0.000, 0.000);


			const geometry = new THREE.SphereGeometry( 1, 32, 16, 0, Math.PI * 2, 0, Math.PI );
			const mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
			mesh.name = 'Sphere';
			mesh.scale.set(0.0001, 0.0001, 0.0001);
			mesh.position.set(0, -0.5, 0);

			const geometry1 = new THREE.SphereGeometry( 1, 32, 16, 0, Math.PI * 2, 0, Math.PI );
			const mesh1 = new THREE.Mesh( geometry1, new THREE.MeshStandardMaterial() );
			mesh1.name = 'Sphere2';
			mesh1.scale.set(0.0001, 0.0001, 0.0001);
			mesh1.position.set(0, 0, 0.3);

			const geometry2 = new THREE.SphereGeometry( 1, 32, 16, 0, Math.PI * 2, 0, Math.PI );
			const mesh2 = new THREE.Mesh( geometry2, new THREE.MeshStandardMaterial() );
			mesh2.name = 'Sphere3';
			mesh2.scale.set(0.0001, 0.0001, 0.0001);
			mesh2.position.set(0.2, 0, 0);

			const geometry3 = new THREE.SphereGeometry( 1, 32, 16, 0, Math.PI * 2, 0, Math.PI );
			const mesh3 = new THREE.Mesh( geometry3, new THREE.MeshStandardMaterial() );
			mesh3.name = 'Sphere4';
			mesh3.scale.set(0.0001, 0.0001, 0.0001);
			mesh3.position.set(-0.2, 0, 0);

			const geometry4 = new THREE.SphereGeometry( 1, 32, 16, 0, Math.PI * 2, 0, Math.PI );
			const mesh4 = new THREE.Mesh( geometry4, new THREE.MeshStandardMaterial() );
			mesh4.name = 'Sphere5';
			mesh4.scale.set(0.0001, 0.0001, 0.0001);
			mesh4.position.set(0, 0, -0.3);
			

			//editor.execute( new AddObjectCommand( editor, mesh ) );
			//editor.execute( new AddObjectCommand( editor, mesh1 ) );
			//editor.execute( new AddObjectCommand( editor, mesh2 ) );
			//editor.execute( new AddObjectCommand( editor, mesh3 ) );
			//editor.execute( new AddObjectCommand( editor, mesh4 ) );
		
			const faceMeshLoader = new FBXLoader();
			faceMeshLoader.load('model/face_mesh.fbx', (object) => {
			
				object.name = 'face_mesh';
				object.rotation.set(-Math.PI,0,-Math.PI);
				object.scale.set(.01, .01, .01)
				//object.geometry.
				const face = object
				editor.execute( new AddObjectCommand(editor, object));
   		 	});


			editor.execute( new AddObjectCommand(editor, light1));
			editor.execute( new AddObjectCommand(editor, light2));
			editor.execute( new AddObjectCommand(editor, light3));
			editor.execute( new AddObjectCommand(editor, light4));
			editor.execute( new AddObjectCommand(editor, light5));




		}

	} );
	options.add( option );

	//

	options.add( new UIHorizontalRule() );

	// Import

	const form = document.createElement( 'form' );
	form.style.display = 'none';
	document.body.appendChild( form );

	const fileInput = document.createElement( 'input' );
	fileInput.multiple = true;
	fileInput.type = 'file';
	fileInput.addEventListener( 'change', function () {

		editor.loader.loadFiles( fileInput.files );
		form.reset();

	} );
	form.appendChild( fileInput );

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/import' ) );
	option.onClick( function () {

		fileInput.click();

	} );
	options.add( option );

	//

	options.add( new UIHorizontalRule() );

	// Export Geometry

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/geometry' ) );
	option.onClick( function () {

		const object = editor.selected;

		if ( object === null ) {

			alert( 'No object selected.' );
			return;

		}

		const geometry = object.geometry;

		if ( geometry === undefined ) {

			alert( 'The selected object doesn\'t have geometry.' );
			return;

		}

		let output = geometry.toJSON();

		try {

			output = JSON.stringify( output, null, '\t' );
			output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		} catch ( e ) {

			output = JSON.stringify( output );

		}

		saveString( output, 'geometry.json' );

	} );
	options.add( option );

	// Export Object

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/object' ) );
	option.onClick( function () {

		const object = editor.selected;

		if ( object === null ) {

			alert( 'No object selected' );
			return;

		}

		let output = object.toJSON();

		try {

			output = JSON.stringify( output, null, '\t' );
			output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		} catch ( e ) {

			output = JSON.stringify( output );

		}

		saveString( output, 'model.json' );

	} );
	options.add( option );

	// Export Scene

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/scene' ) );
	option.onClick( function () {

		let output = editor.scene.toJSON();

		try {

			output = JSON.stringify( output, null, '\t' );
			output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		} catch ( e ) {

			output = JSON.stringify( output );

		}

		saveString( output, 'scene.json' );

	} );
	options.add( option );

	//

	options.add( new UIHorizontalRule() );

	// Export DRC

	// option = new UIRow();
	// option.setClass( 'option' );
	// option.setTextContent( strings.getKey( 'menubar/file/export/drc' ) );
	// option.onClick( async function () {

	// 	const object = editor.selected;

	// 	if ( object === null || object.isMesh === undefined ) {

	// 		alert( 'No mesh selected' );
	// 		return;

	// 	}

	// 	const { DRACOExporter } = await import( 'three/addons/exporters/DRACOExporter.js' );

	// 	const exporter = new DRACOExporter();

	// 	const options = {
	// 		decodeSpeed: 5,
	// 		encodeSpeed: 5,
	// 		encoderMethod: DRACOExporter.MESH_EDGEBREAKER_ENCODING,
	// 		quantization: [ 16, 8, 8, 8, 8 ],
	// 		exportUvs: true,
	// 		exportNormals: true,
	// 		exportColor: object.geometry.hasAttribute( 'color' )
	// 	};

	// 	// TODO: Change to DRACOExporter's parse( geometry, onParse )?
	// 	const result = exporter.parse( object, options );
	// 	saveArrayBuffer( result, 'model.drc' );

	// } );
	// options.add( option );

	// Export GLB

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/glb' ) );
	option.onClick( async function () {


		

		const scene = editor.scene;
		const animations = getAnimations( scene );
		//scene.object.geometry.
		

		const { GLTFExporter } = await import( 'three/addons/exporters/GLTFExporter.js' );

		const exporter = new GLTFExporter();

		exporter.parse( scene, function ( result ) {

			saveArrayBuffer( result, 'scene.glb' );

		}, undefined, { binary: true, animations: animations } );

	} );
	options.add( option );

	// Export GLTF

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/gltf' ) );
	option.onClick( async function () {

		const geometry = new THREE.SphereGeometry( 1, 32, 16, 0, Math.PI * 2, 0, Math.PI );
		const mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
		mesh.name = 'Sphere';
		mesh.scale.set(0.0001, 0.0001, 0.0001);
		mesh.position.set(0, -0.5, 0);

		const geometry1 = new THREE.SphereGeometry( 1, 32, 16, 0, Math.PI * 2, 0, Math.PI );
		const mesh1 = new THREE.Mesh( geometry1, new THREE.MeshStandardMaterial() );
		mesh1.name = 'Sphere2';
		mesh1.scale.set(0.0001, 0.0001, 0.0001);
		mesh1.position.set(0, 0, 0.3);

		const geometry2 = new THREE.SphereGeometry( 1, 32, 16, 0, Math.PI * 2, 0, Math.PI );
		const mesh2 = new THREE.Mesh( geometry2, new THREE.MeshStandardMaterial() );
		mesh2.name = 'Sphere3';
		mesh2.scale.set(0.0001, 0.0001, 0.0001);
		mesh2.position.set(0.2, 0, 0);

		const geometry3 = new THREE.SphereGeometry( 1, 32, 16, 0, Math.PI * 2, 0, Math.PI );
		const mesh3 = new THREE.Mesh( geometry3, new THREE.MeshStandardMaterial() );
		mesh3.name = 'Sphere4';
		mesh3.scale.set(0.0001, 0.0001, 0.0001);
		mesh3.position.set(-0.2, 0, 0);

		const geometry4 = new THREE.SphereGeometry( 1, 32, 16, 0, Math.PI * 2, 0, Math.PI );
		const mesh4 = new THREE.Mesh( geometry4, new THREE.MeshStandardMaterial() );
		mesh4.name = 'Sphere5';
		mesh4.scale.set(0.0001, 0.0001, 0.0001);
		mesh4.position.set(0, 0, -0.3);

		//editor.scene.add(mesh1)
		//editor.scene.add(mesh2)
		//editor.scene.add(mesh3)
		//editor.scene.add(mesh4)
		//editor.scene.add(mesh)


		editor.execute( new AddObjectCommand( editor, mesh ) );
		editor.execute( new AddObjectCommand( editor, mesh1 ) );
		editor.execute( new AddObjectCommand( editor, mesh2 ) );
		editor.execute( new AddObjectCommand( editor, mesh3 ) );
		editor.execute( new AddObjectCommand( editor, mesh4 ) );

		const scene = editor.scene;
		const animations = getAnimations( scene );
		//scene.rotation.set
		//scene.rotation.set(Math.PI/2,0,0);
		
		const { GLTFExporter } = await import( 'three/addons/exporters/GLTFExporter.js' );

		const exporter = new GLTFExporter();

		exporter.parse( scene, function ( result ) {

			saveString( JSON.stringify( result, null, 2 ), 'scene.gltf' );

		}, undefined, { animations: animations } );

		editor.execute(new RemoveObjectCommand(editor, mesh))
		editor.execute(new RemoveObjectCommand(editor, mesh1))
		editor.execute(new RemoveObjectCommand(editor, mesh2))
		editor.execute(new RemoveObjectCommand(editor, mesh3))
		editor.execute(new RemoveObjectCommand(editor, mesh4))


	} );
	options.add( option );

	// Export OBJ

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/obj' ) );
	option.onClick( async function () {

		const object = editor.selected;

		if ( object === null ) {

			alert( 'No object selected.' );
			return;

		}

		const { OBJExporter } = await import( 'three/addons/exporters/OBJExporter.js' );

		const exporter = new OBJExporter();

		saveString( exporter.parse( object ), 'model.obj' );

	} );
	options.add( option );

	// Export PLY (ASCII)

	// option = new UIRow();
	// option.setClass( 'option' );
	// option.setTextContent( strings.getKey( 'menubar/file/export/ply' ) );
	// option.onClick( async function () {

	// 	const { PLYExporter } = await import( 'three/addons/exporters/PLYExporter.js' );

	// 	const exporter = new PLYExporter();

	// 	exporter.parse( editor.scene, function ( result ) {

	// 		saveArrayBuffer( result, 'model.ply' );

	// 	} );

	// } );
	// options.add( option );

	// Export PLY (Binary)

	// option = new UIRow();
	// option.setClass( 'option' );
	// option.setTextContent( strings.getKey( 'menubar/file/export/ply_binary' ) );
	// option.onClick( async function () {

	// 	const { PLYExporter } = await import( 'three/addons/exporters/PLYExporter.js' );

	// 	const exporter = new PLYExporter();

	// 	exporter.parse( editor.scene, function ( result ) {

	// 		saveArrayBuffer( result, 'model-binary.ply' );

	// 	}, { binary: true } );

	// } );
	// options.add( option );

	// Export STL (ASCII)

	// option = new UIRow();
	// option.setClass( 'option' );
	// option.setTextContent( strings.getKey( 'menubar/file/export/stl' ) );
	// option.onClick( async function () {

	// 	const { STLExporter } = await import( 'three/addons/exporters/STLExporter.js' );

	// 	const exporter = new STLExporter();

	// 	saveString( exporter.parse( editor.scene ), 'model.stl' );

	// } );
	// options.add( option );

	// Export STL (Binary)

	// option = new UIRow();
	// option.setClass( 'option' );
	// option.setTextContent( strings.getKey( 'menubar/file/export/stl_binary' ) );
	// option.onClick( async function () {

	// 	const { STLExporter } = await import( 'three/addons/exporters/STLExporter.js' );

	// 	const exporter = new STLExporter();

	// 	saveArrayBuffer( exporter.parse( editor.scene, { binary: true } ), 'model-binary.stl' );

	// } );
	// options.add( option );

	// Export USDZ

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/usdz' ) );
	option.onClick( async function () {

		const scene = editor.scene
		//scene.rotation.set(Math.PI/2,0,0);
		const { USDZExporter } = await import( 'three/addons/exporters/USDZExporter.js' );

		const exporter = new USDZExporter();

		saveArrayBuffer( await exporter.parse( editor.scene ), 'model.usdz' );

	} );
	options.add( option );

	//

	options.add( new UIHorizontalRule() );

	// Publish

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/publish' ) );
	option.onClick( function () {

		const toZip = {};

		//

		let output = editor.toJSON();
		output.metadata.type = 'App';
		delete output.history;

		output = JSON.stringify( output, null, '\t' );
		output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		toZip[ 'app.json' ] = strToU8( output );

		//

		const title = config.getKey( 'project/title' );

		const manager = new THREE.LoadingManager( function () {

			const zipped = zipSync( toZip, { level: 9 } );

			const blob = new Blob( [ zipped.buffer ], { type: 'application/zip' } );

			save( blob, ( title !== '' ? title : 'untitled' ) + '.zip' );

		} );

		const loader = new THREE.FileLoader( manager );
		loader.load( 'js/libs/app/index.html', function ( content ) {

			content = content.replace( '<!-- title -->', title );

			const includes = [];

			content = content.replace( '<!-- includes -->', includes.join( '\n\t\t' ) );

			let editButton = '';

			if ( config.getKey( 'project/editable' ) ) {

				editButton = [
					'			let button = document.createElement( \'a\' );',
					'			button.href = \'https://threejs.org/editor/#file=\' + location.href.split( \'/\' ).slice( 0, - 1 ).join( \'/\' ) + \'/app.json\';',
					'			button.style.cssText = \'position: absolute; bottom: 20px; right: 20px; padding: 10px 16px; color: #fff; border: 1px solid #fff; border-radius: 20px; text-decoration: none;\';',
					'			button.target = \'_blank\';',
					'			button.textContent = \'EDIT\';',
					'			document.body.appendChild( button );',
				].join( '\n' );

			}

			content = content.replace( '\t\t\t/* edit button */', editButton );

			toZip[ 'index.html' ] = strToU8( content );

		} );
		loader.load( 'js/libs/app.js', function ( content ) {

			toZip[ 'js/app.js' ] = strToU8( content );

		} );
		loader.load( '../build/three.module.js', function ( content ) {

			toZip[ 'js/three.module.js' ] = strToU8( content );

		} );
		loader.load( '../examples/jsm/webxr/VRButton.js', function ( content ) {

			toZip[ 'js/VRButton.js' ] = strToU8( content );

		} );

	} );
	options.add( option );

	//

	const link = document.createElement( 'a' );
	function save( blob, filename ) {

		if ( link.href ) {

			URL.revokeObjectURL( link.href );

		}

		link.href = URL.createObjectURL( blob );
		link.download = filename || 'data.json';
		link.dispatchEvent( new MouseEvent( 'click' ) );

	}

	function saveArrayBuffer( buffer, filename ) {

		save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );

	}

	function saveString( text, filename ) {

		save( new Blob( [ text ], { type: 'text/plain' } ), filename );

	}

	function getAnimations( scene ) {

		const animations = [];

		scene.traverse( function ( object ) {

			animations.push( ... object.animations );

		} );

		return animations;

	}

	return container;

}

export { MenubarFile };
