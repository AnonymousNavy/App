function init(){
	//화면 설정
	var install_date = getParameter('install_date');
	var block_date = getParameter('block_date');
	var device_maker = getParameter('device_maker');
	var device_model = getParameter('device_model');
	var device_os = getParameter('device_os');
	var log = getParameter('log');
	
	if(log != null && log.length > 0){
		print_log();
	}


	document.getElementById('install_date').innerHTML = install_date;
	document.getElementById('block_date').innerHTML = block_date;
	document.getElementById('device_maker').innerHTML = device_maker;
	document.getElementById('device_model').innerHTML = device_model;
	document.getElementById('device_os').innerHTML = device_os;

	document.getElementById('install_date_input').value = install_date;
	document.getElementById('block_date_input').value = block_date;
	document.getElementById('device_maker_input').value = device_maker;
	document.getElementById('device_model_input').value = device_model;
	document.getElementById('device_os_input').value = device_os;
	document.getElementById('log_input').value = log;

	//log 설정

	//시간 계산(현재시간 - 차단 시작한 시간)
	check_time(block_date);

	//시간 설정
	setInterval(function() {
		check_time(block_date);
	}, 1000);

	//device size 적용
	var mobile_size = getParameter('mobile_size');
	if(mobile_size != null && mobile_size.length > 0){
		document.getElementById('mobile_size_input').value = mobile_size;
		adapt_page(mobile_size);
	}else{
		adapt_page(305);
	}
}
function getParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function check_time(block_date){
				
	var start_date;
	if(block_date == null || block_date.length < 1){
			start_date = new Date();
	}else{
		var block_year = block_date.substring(0,2) * 1 + 2000;
		var block_month = block_date.substring(3,5);
		var block_day = block_date.substring(6,8);

		var block_hour = block_date.substring(9,11);
		var block_min = block_date.substring(12,14);

		start_date = new Date(refine_time(block_year), refine_time(block_month)-1, refine_time(block_day), refine_time(block_hour), refine_time(block_min));
	}

	var now_date = new Date();

	var interval = now_date.getTime()-start_date.getTime();
	var interval_day = Math.floor(interval / (1000*60*60*24));
	interval -= interval_day * 1000*60*60*24;

	var interval_hour = Math.floor(interval / (1000*60*60));
	interval -= interval_hour * 1000*60*60;
	var interval_min = Math.floor(interval / (1000*60));
	interval -= interval_min * 1000*60;
	var interval_sec = Math.floor(interval / (1000));

	if(interval_hour < 10){
		interval_hour = '0' + interval_hour;
	}
	if(interval_min < 10){
		interval_min = '0' + interval_min;
	}
	if(interval_sec < 10){
		interval_sec = '0' + interval_sec;
	}

	document.getElementById('sub_date').innerHTML = interval_day + '일<br/>' + interval_hour + ":" + interval_min + ":" + interval_sec;

};

function refine_time(time){
	time += '';
	if(time.substring(0,1) == '0'){
		time = time.substring(1,time.length);
	}
	return time*1;
};
function adapt_page(device_size){
	var top = document.getElementById('background_top').height * 1;
	var bottom = document.getElementById('background_top').height * 1;
	//var device = window.innerHeight * 1;
	var device = device_size * 1;

	var repeat_size = device - top - bottom;
	if(document.getElementById('background_repeat').height * 1 != repeat_size){
		document.getElementById('background_repeat').style.height = repeat_size + 'px';
	}
};
function changePage(page_name){
	var page_list = ['page_main', 'page_menu', 'page_log', 'page_guide1', 'page_guide2', 'page_guide3', 'page_location'];
	page_list.forEach(function(page) {
		if(page == page_name){
			document.getElementById(page).style.display = 'block';
		}else{
			document.getElementById(page).style.display = 'none';
		}
	});
};

function setting_log(){
	var install_date = document.getElementById('install_date_input').value;
	var block_date = document.getElementById('block_date_input').value;
	var device_maker = document.getElementById('device_maker_input').value;
	var device_os = document.getElementById('device_os_input').value;
	if(install_date == null || install_date.length < 1 || device_maker == null || device_maker.length < 1 || block_date == null || block_date.length < 1 || device_os == null || device_os.length < 1){
		alert('위의 내용을 다 입력 후 눌러주세요!');
	}else if(device_maker != 'Apple'){
		alert('샘송은 내용을 직접입력하세요. 애플만 쓸수 있습니다.');
	}else{
		//json 생성 후 input에 저장
		
		document.getElementById('log_input').value = '';
		
		var log_list = new Array() ;

		//보안앱 최초 설치
		// 객체 생성
		var log = new Object() ;

		//초 추가
		var seconds = Math.floor(Math.random() * 60) * 1;
		if(seconds < 10){
			seconds = '0' + seconds;
		}

		log.status = 'install';
		log.date = install_date + ':' + seconds;
		log.content = '보안앱 최초 설치';
		log.version = 'IOS ' + device_os + ' | 2.0.03';

		// 리스트에 생성된 객체 삽입
		log_list.push(log) ;

		log = new Object() ;

		//초 추가
		seconds = Math.floor(Math.random() * 60) * 1;
		if(seconds < 10){
			seconds = '0' + seconds;
		}

		log.status = 'block';
		log.date = block_date + ':' + seconds;
		log.content = '카메라 차단 프로파일 설치 | NFC';
		log.version = 'IOS ' + device_os + ' | 2.0.03';

		// 리스트에 생성된 객체 삽입
		log_list.push(log);


		// String 형태로 변환
		var jsonData = JSON.stringify(log_list) ;

		document.getElementById('log_input').value = jsonData;
	}
};

function add_log(){
	var log_list =  document.getElementById('log_input').value;
	var log_json;
	if(log_list == null || log_list.length < 1){
		log_json = new Array() ;
	}else{
		log_json = JSON.parse(log_list);
	}
	
	var device_maker = document.getElementById('device_maker_input').value;
	var device_os = document.getElementById('device_os_input').value;
	var log_contents = document.getElementsByName('log_contents').value;

	var log_status;
	var obj_length = document.getElementsByName('log_status').length;
	for (var i=0; i<obj_length; i++) {
		if (document.getElementsByName('log_status')[i].checked == true) {
			log_status = document.getElementsByName('log_status')[i].value;
		}
	}
	
	var log = new Object() ;
	//초 추가
	var seconds = Math.floor(Math.random() * 60) * 1;
	if(seconds < 10){
		seconds = '0' + seconds;
	}
	
	log.status = log_status;
	log.date = log_contents + ':' + seconds;
	
	if(log_status == 'install'){
		log.content = '보안앱 최초 설치';
	}else if(log_status == 'block'){
		log.content = '카메라 차단 프로파일 설치 | NFC';
	}
	
	if(device_maker == 'Apple'){
		log.version = 'IOS ' + device_os + '|2.0.03';
	}else{
		log.version = 'Android ' + device_os + '|2.0.03';
	}
	
	log_json.push(log);
	var jsonData = JSON.stringify(log_json) ;

	document.getElementById('log_input').value = jsonData;
	alert(jsonData);
	
	document.getElementById('log_contents_input').value = '';
};

//log 시간순 정렬후 출력
function print_log(){
	var log_list = getParameter('log');
	
	var log_json;
	if(log_list == null || log_list.length < 1){
		log_json = new Array() ;
	}else{
		log_json = JSON.parse(log_list);
	}
	
	var sorted_json = log_json.sort(function(a, b) {
		var x = a['date'];
		var y = b['date'];
		return x > y ? -1 : x < y ? 1 : 0;
	});
	
	//이어서 수정
	log_json.forEach(function(json){
		var log_status = json.status;
		var log_contents = json.content;
		var log_date = json.date;
		var log_version = json.version;
		
		var log_body = '<div class="log_body" style="background-color: ';
		
		if(log_status == 'install'){
			log_body += '#383838';
		}else if(log_status == 'block'){
			log_body += '#52443F';
		}
		
		log_body += ';">'
		log_body += log_date + '<br/>' + log_contents + '<br/>' + log_version + '</div>';
		document.getElementById('log_body').insertAdjacentHTML('beforeend', log_body);
		;
	});
	
	
};
//https://justjava.tistory.com/60
			