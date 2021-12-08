// 요구사항
/*
// TODO: 페이지 접근시 최초 데이터 Read & Rendering
- [x] 예약 목록를 표출한다.
- [x] 예약 상세를 표출한다.
- [x] 초기 예약 상세는 첫 번째 예약 아이템을 표출
- [x] 예약 목록 내에 있는 리스트를 표출한다.
- [x] reservations.status가 done 이면 표출하지 않는다.

// TODO: 스타일링
- [X] 예약 아이템 내에 예약 데이터를 좌측, 중앙, 및 우측으로 3열로 구분하여 표출한다.
- [X] 좌측에 예약 시간과 예약 상태를 1열 2행으로 중앙 정렬로 표출한다.

- [x] 중앙은 1열 3행으로 표출한다.
- [x] "예약자명 - 테이블명 [, 테이블명]"
- [x] "성인 00 아이 00"
- [x] "메뉴명(갯수) [, 메뉴명(갯수)]"

- [x] 우측에 [착석] 또는 [퇴석] 버튼을 표출한다.
- [x] reserved면 [착석] (버튼 색상 - #162149)
- [x] [착석] 버튼을 클릭 시 [퇴석] 으로 변경된다.
- [x] seated면 [퇴석] (버튼 색상 - #ffffff)

- [x] 고객 메모 및 요청 사항 데이터는 최대 3행으로 표출
- [x] 그 외 데이터는 1행으로 표출

// TODO: 데이터에 따른 상태값 변화
- [x] 예약 상태가 reserved 일 경우 "예약" (글씨 색상 - #3BB94C) 한글로 표시한다.
- [x] 예약 상태가  seated 일 경우  "착석 중" (글씨 색상 - #162149) 한글로 표시한다.

// TODO: 이벤트 처리
- [x] 예약 아이템을 클릭하면 예약 상세 (예약 및 고객 정보)에 관련 데이터를 표출한다.

// TODO: 데스크탑 환경에서 적용 사항 (1024px 이상)
- [x] Desktop은 오른쪽 예약 상세에 표출

// TODO: 모바일 환경에서 적용 사항 (1024px 미만)
- [x] Mobile은 예약 상세 팝업에 표출
- [x] 팝업의 닫기를 터치하면 팝업 종료
- [x] dim 영역을 터치하면 팝업 종료
*/

const BASE_URL = "http://3.35.25.199/v1/store/9533/reservations"

const $ = (selector) => document.querySelector(selector);



function App() {
  this.currentListItemId = 0;
  this.detailState = [];

  window.onload = () => {
    if (window.innerWidth < 1024) {
      $(".detail-container").classList.add("modal-inner")
    }
  }

  window.onresize = () => {
    if (window.innerWidth < 1024) {
      $(".detail-container").classList.add("modal-inner")
    }
  }

  const detailModal = $(".detail-container");
  const modalDim = $(".modal-dim");
  modalDim.addEventListener("click", () => {
    detailModal.classList.add("hidden");
    modalDim.classList.add("hidden");
  });

  $(".detail-container").addEventListener("click", (e) => {
    if (e.target.classList.value.match("detail-close-button")[0] === "detail-close-button") {
      detailModal.classList.add("hidden");
      modalDim.classList.add("hidden");
    }
  })

  $(".list").addEventListener("click", (e) => {
    // [착석] 버튼을 클릭 시 [퇴석] 으로 변경된다
    if (e.target.classList.contains("list-right-button")) {
      e.target.classList.remove("reserved");
      e.target.innerHTML = "퇴석";
      e.target.classList.add("seated");
      return;
    }

    // 상세 정보를 볼 수 있게 id 값을 넘겨줌
    let checkId = e.target.closest("article").dataset.reservationId;
    this.currentListItemId = checkId;

    if (window.innerWidth < 1024) {
      $(".detail-container").classList.remove("hidden")
      $(".modal-dim").classList.remove("hidden")
      ShowDetail(this.detailState);
      return
    }
    ShowDetail(this.detailState);
  })

  const ShowList = (item, index) => {
    if (item.status === "done") return;

    let tableNames = "";
    let menuNameAndQty = "";

    // 테이블명 배열 나열
    if (item.tables) {
      for (let i = 0; i < item.tables.length; i++) {
        i === 0 ? tableNames += item.tables[i].name : tableNames += `, ` + item.tables[i].name
      }
    }

    // 메뉴명, 갯수 배열 나열
    if (item.menus) {
      for (let i = 0; i < item.menus.length; i++) {
        i === 0 ? menuNameAndQty += item.menus[i].name + `(${item.menus[i].qty})` : menuNameAndQty += `, ` + item.menus[i].name + `(${item.menus[i].qty})`
      }
    }
    return $(".list-container").innerHTML += `<article data-reservation-id="${index}" class="list-inner">
        <div class="list-left">
          <ul>
            <li>
              <div class="list-left-timeReserved">${item.timeReserved.slice(10, 16)}</div>
            </li>
            <li>
              <div class="list-left-status ${item.status}">${item.status === "reserved" ? "예약" : "착석 중"}</div>
            </li>
          </ul>
        </div>
        <div class="list-center">
          <ul>
            <li>
              <div class="list-center-name">
                <span class="list-customer-name">${item.customer.name}</span>
                -
                <span class="list-center-table-name">${tableNames}</span >
              </div >
            </li >
            <li>
              <div class="list-center-customer-number">
                성인 <span class="adult-number">${item.customer.adult > 9 ? item.customer.adult : "0" + item.customer.adult}</span>
                아이 <span class="child-number">${item.customer.child > 9 ? item.customer.child : "0" + item.customer.child}</span>
              </div>
            </li>
            <li>
              <div class="list-center-menu">
                <span class="menu-name">${menuNameAndQty}</span>
              </div>
            </li>
          </ul >
        </div >
        <div class="list-right">
          <button class="list-right-button ${item.status}">${item.status === "reserved" ? "착석" : "퇴석"}</button>
        </div>
      </article > `;
  }

  const ShowDetail = (state, index) => {
    let item = state[this.currentListItemId].reservation;
    return $(".detail-container").innerHTML = `<article class="detail-reservation-info">
            <div class="detail-head-container">
              <h2 class="detail-head-title">예약 정보</h2>
              <button class="detail-close-button">닫기</button>
            </div>
            <ul class="detail-info-flex">
              <li class="inner_flex">
                <div class="detail-text__gray grow1">예약 상태</div>
                <div class="detail-reservation-status detail-text-value grow4 ${item.status}">${item.status === "reserved" ? "예약" : "착석 중"}</div>
              </li>
              <li class="inner_flex">
                <div class="detail-text__gray grow1">예약 시간</div>
                <div class="detail-text-value detail-reservation-timeReserved grow4">${item.timeReserved.slice(10, 16)}</div>
              </li>
              <li class="inner_flex">
                <div class="detail-text__gray grow1">접수 시간</div>
                <div class="detail-reservation-timeRegisterd detail-text-value grow4">${item.timeRegistered.slice(10, 16)}</div>
              </li>
            </ul>
          </article>
          <article class="detail-user-info">
            <h2 class="detail-head-title detail-head-container">고객 정보</h2>
            <ul class="detail-info-flex">
              <li class="inner_flex">
                <div class="detail-text__gray grow1">고객 성명</div>
                <div class="detail-customer-name grow4 detail-text-value">${item.customerName}</div>
              </li>
              <li class="inner_flex">
                <div class="detail-text__gray grow1">고객 등급</div>
                <div class="detail-customer-level grow4 detail-text-value">
                  ${item.customerLevel}</div>
              </li>
              <li class="inner_flex">
                <div class="detail-text__gray grow1">고객 메모</div>
                <div class="detail-customer-memo grow4">
                  ${item.customerMemo}
                </div>
              </li>
              <li class="inner_flex">
                <div class="detail-text__gray grow1">요청사항</div>
                <div class="detail-customer-request grow4">
                  ${item.customerRequest}</div>
              </li class="inner_flex">
            </ul>
          </article>`
  }

  const render = async () => {
    const getData = await axios.get(BASE_URL)
    const reservations = await getData.data.reservations
    reservations.forEach((item, index) => {
      let reservation = {
        status: item.status,
        timeReserved: item.timeReserved,
        timeRegistered: item.timeRegistered,
        customerName: item.customer.name,
        customerLevel: item.customer.level,
        customerMemo: item.customer.memo,
        customerRequest: item.customer.request
      }
      this.detailState.push({ reservation });

      ShowList(item, index);
      ShowDetail(this.detailState);
    })
  }
  render();
}

const app = new App();
