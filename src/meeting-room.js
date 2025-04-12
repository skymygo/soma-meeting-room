let idList = [];
let timetableList = [];
let curDate = '';

function createTimeLabels(){
    const timeLabels = document.createElement("div");
    timeLabels.className = "time-labels";
    for (let h = 9; h <= 23; h++) {
        const label = document.createElement("span");
        label.innerText = h.toString().padStart(2, '0');
        timeLabels.appendChild(label);
    }
    
    return timeLabels;
}

function getTimeData(rentId, rentDate){
    const targetUrl = `https://www.swmaestro.org/sw/mypage/officeMng/rentTime.do?viewType=CONTBODY&itemId=${rentId}&rentDt=${rentDate}`

    return fetch(targetUrl)
        .then(response => {
            if (!response.ok) throw new Error("❌ 요청 실패");
            return response.text();
        })
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, "text/html");
            let checkedList = []
            for(let i=1;i<31;i++){
                checkedList.push(doc.querySelector(`#time1_${i}`).disabled)
            }
            return checkedList;
        })
        .catch(error => {
            console.error("⚠️ 에러:", error);
        });
    
}

async function createTimeSlots(rentId, rentDate){
    const timeSlots = document.createElement("div");
    timeSlots.className = "time-slots"

    checkedList = await getTimeData(rentId,rentDate)
    for(let ck of checkedList){
        if(ck){
            timeSlots.innerHTML += "<div class='slot occupied'></div>";
        }else{
            timeSlots.innerHTML += "<div class='slot empty'></div>";                
        }
    }

    return timeSlots
}

async function createEachTimeTable(rentId, rentDate){
    console.log(rentId, rentDate)
    if(curDate != rentDate){
        return 
    }
    const wrapper = document.createElement("div");
    wrapper.id = "timeTableWrapper";
    response = await createTimeSlots(rentId, rentDate)
    if(curDate != rentDate){
        return 
    }
    wrapper.appendChild(createTimeLabels())
    wrapper.appendChild(response)
    return wrapper
}

function createTimetable(){
    const selectedDate = document.querySelector("#sdate").value;
    if(selectedDate === undefined || selectedDate == curDate){
        return
    }

    curDate = selectedDate
    const meetingRoom = document.querySelectorAll("ul.bbs-reserve > li.item");
    for (const mr of meetingRoom) {
        createEachTimeTable(mr.querySelector("a").href.split("&itemId=")[1], selectedDate)
        .then(response => {mr.appendChild(response);})
    }
}

setInterval(createTimetable, 1000);