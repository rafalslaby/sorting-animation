// zmienna przechowująca tablice
var tab = null;
// flaga mowiaca czy trwa animacja
var running = false;
// tablica id setTimeOut'ow, potrzebna do stopowania animacji
var timeouts = [];
// zmienna przechowujaca czas podniesienia liczby
var upliftSeconds = 0.75;
// comparator transition time
var comparatorOpacityTransition = 0.75;
// horizontal speed swapping time factor
var horizontalSpeedFactor = 0.75;



//funkcja wypełniająca tablice losowymi liczbami z zakresu 0-10
function fillTabRandomly(n)
{
	stopSorting();
	tab = new Array(n);
	for(let i = 0;i<n;i++)
	{
		tab[i] = Math.floor((Math.random() * 10));
	}
	prepareArrayDiv();
}

//funkcja czyszczaca wszystkie timeOut'y potrzebna przy stopowaniu animacji
function clearAllTimeouts()
{
	for (var i=0; i<timeouts.length; i++) {
		clearTimeout(timeouts[i]);
	}
	timeouts = [];
}

//funkcja przygotowujaca div'y z numerkami oraz div na cala tablice
function prepareArrayDiv()
{
	if(tab != null)
	{
		upliftSeconds = comparatorOpacityTransition = horizontalSpeedFactor = document.getElementsByClassName("slider")[0].value / 100.0;

		let n = tab.length;
		var arrayDiv = document.getElementsByClassName("arrayDiv")[0];
		arrayDiv.innerHTML = '';

		arrayDiv.style.border ='2px solid black';

		arrayDiv.style.height = 70 + 'px';
		arrayDiv.style.width = 70*n + 'px';
		for(let i = 0;i<tab.length;i++)
		{
			var newDiv = document.createElement("div");
			newDiv.className = "node number";
			newDiv.style.left = 70*i + 'px';
			newDiv.id = 'n' + i;
			newDiv.innerHTML=tab[i];
			newDiv.style.transition = "top " + upliftSeconds + "s, color 1s";
			arrayDiv.appendChild(newDiv);
		}

		var newDiv = document.createElement("div");
		newDiv.className = "node comparator";
		newDiv.id = 'c1';
		arrayDiv.appendChild(newDiv);

		document.getElementsByClassName('arrayContainer')[0].style.display = 'flex'; 
	}
}


//funkcja inicjujaca sekwencje animacji zamiany numerkow, przyjmuje obiekty Node
// time = (2 * upliftSeconds + Math.abs(i - min) * horizontalSpeedFactor)*1000
function swap(node1, node2)
{
	node1.style.top = -70 + 'px';
	node2.style.top = 70 + 'px';
	let distance = Math.abs( ( parseInt(node1.style.left.toString()) - parseInt(node2.style.left.toString()))/70.0);
	let leftSpeed = distance * horizontalSpeedFactor;
	node1.style.transition = node2.style.transition = "top " + upliftSeconds + "s, color 1s, left " + leftSpeed + "s";
	timeouts.push(setTimeout( () => {swapSequence1(node1,node2,leftSpeed);}, upliftSeconds * 1000 ) );
}

//druga czesc sekwencji zamiany
function swapSequence1(node1, node2, leftSpeed)
{
	let left1tmp =  node1.style.left;
	node1.style.left = node2.style.left;
	node2.style.left = left1tmp;
	timeouts.push(setTimeout( () => {swapSequence2(node1,node2);}, leftSpeed * 1000 ));
}

//ostatnia czesc sekwencji zamiany
function swapSequence2(node1,node2)
{
	node1.style.top = 0 + 'px';
	node2.style.top = 0 + 'px';
	let id1tmp = node1.id;
	node1.id = node2.id;
	node2.id = id1tmp;

	//wait upliftSeconds after
}


// funkcja inicjujaca animacje porownania dwoch liczb, ktorych divy sa podane w argumentach
// podany jest takze symbol porownania, oraz kolor symbolu
// time = (upliftSeconds + 2*comparatorOpacityTransition + Math.max(comparatorOpacityTransition, upliftSeconds)) * 1000
function compare(symbol, color, node1, node2)
{
	//lifts up the nodes
	node1.style.top = node2.style.top = -70 +"px";
	timeouts.push( setTimeout( () => {compareSequence1(symbol, color, node1, node2);},upliftSeconds * 1000));
}

//porownanie cd
function compareSequence1(symbol, color, node1, node2)
{
	let comparator = document.getElementById('c1');

	//set symbol and color (result of comparision green/red)
	comparator.innerHTML = symbol;
	comparator.style.color = color;

	//move between nodes
	comparator.style.top = -70 + 'px';

	let n1left = (parseInt(node1.style.left.toString()));
	let n2left = (parseInt(node2.style.left.toString()));

	comparator.style.left = Math.abs(n1left - n2left)/2 + Math.min(n1left,n2left) + 'px';
	//show comparator
	comparator.style.opacity = '1';

	timeouts.push(setTimeout(() => {compareSequence2(node1, node2);}, 2 * comparatorOpacityTransition * 1000));
}

//porownanie cd
function compareSequence2(node1, node2)
{
	let comparator = document.getElementById('c1');

	//hide comparator
	comparator.style.opacity = '0';

	//lower the nodes
	node1.style.top = node2.style.top = 0 + 'px';

	//wait max (comparatorOpacityTransition, upliftSeconds)
}



//funkcja iniciujaca animacje porownania bez dzwigania liczb ponad tablice
//dostaje symbol porownania, kolor symbolu oraz porownywane obiekty
//time = 3 * comparatorOpacityTransition * 1000
function compareWithoutLifting(symbol, color, node1, node2)
{
	let comparator = document.getElementById('c1');

	//set symbol and color (result of comparision green/red)
	comparator.innerHTML = symbol;
	comparator.style.color = color;

	//move between nodes
	let n1left = (parseInt(node1.style.left.toString()));
	let n2left = (parseInt(node2.style.left.toString()));

	comparator.style.left = Math.abs(n1left - n2left)/2 + Math.min(n1left,n2left) + 'px';
	//show comparator
	comparator.style.opacity = '1';

	timeouts.push(setTimeout(() => {compareWithoutLifting2(node1, node2);}, comparatorOpacityTransition * 2 * 1000));
}


// porownanie cd
function compareWithoutLifting2(node1, node2)
{
	let comparator = document.getElementById('c1');

	//hide comparator
	comparator.style.opacity = '0';
}


//funkcja wypelniajaca tablice danymi ze stringa (string wczytany z inputu)
function fillInputArray(str)
{
	let input;
	if(str.includes(",")){
		input = str.split(',');
	}
	else
		input = str.split(' ');

	if(input.length*70 > window.innerWidth)
	{
		tab = null;
		alert('Liczby nie zmieszcza sie w okienku Twojej przeglądarki!\nPodaj ich mniej lub powiększ okno');
		return;
	}

	tab = new Array(input.length);
	for(let i = 0;i<input.length;i++)
	{
		if(!Number.isInteger(parseInt(input[i])))
		{
			tab = null;
			alert('Podaj liczby oddzielone przecinkami lub spacjami np 1 2 3 4 5');
			document.getElementById('customizedArray').value = '';
			break;
		}
		tab[i] = parseInt(input[i]);
		if(Math.abs(tab[i]) > 100)
		{
			tab = null;
			alert('Liczby muszą być mniejsze od 100');
			document.getElementById('customizedArray').value = '';
			break;
		}
	}
	prepareArrayDiv();
}


//iterator zewnetrznej petli algorytmów sortowania
var i = 0;
//iterator wewnetrznej petli algorytmow sortowania
var j = 0;
//zmienna przechowujaca indeks minimalnego elementu w danym momencie sortowania przez wybieranie
var min;

//enum reprezentujacy maszyne stanow petli dla selectionSort
var selectionSortState = {
	FOR1INIT: 1,
	FOR1START: 2,
	FOR1BODYSTART: 3,
	FOR2INIT:4,
	FOR2START: 5,
	FOR2BODY: 6,
	FOR2END: 7,
	FOR1BODYEND : 8,
	FOR1END: 9
};


//algorytm realizujacy sortowanie przez wybieranie na podstawie przesylania danego stanu petli algorytmu
function selectionComputeNext(state)
{
	switch (state) {
		case selectionSortState.FOR1INIT:
			i = 0;
			timeouts.push(setTimeout(() => {selectionComputeNext(selectionSortState.FOR1START);},0));
			break;
		case selectionSortState.FOR1START:
			if(i<tab.length)
				timeouts.push(setTimeout(() => {selectionComputeNext(selectionSortState.FOR1BODYSTART);},0));
			else
			{
				running = false;
				clearAllTimeouts();
				document.getElementsByClassName('arrayDiv')[0].style.border = "2px solid green";
			}
			break;
		case selectionSortState.FOR1BODYSTART:
			min = i;
			document.getElementById('n' + min).style.color = 'green';
			timeouts.push(setTimeout(() => {selectionComputeNext(selectionSortState.FOR2INIT);},0));
			break;
		case selectionSortState.FOR2INIT:
			j = i+1;
			timeouts.push(setTimeout(() => {selectionComputeNext(selectionSortState.FOR2START);},0));
			break;
		case selectionSortState.FOR2START:
			if(j<tab.length)
				timeouts.push(setTimeout(() => {selectionComputeNext(selectionSortState.FOR2BODY);},0));
			else
				timeouts.push(setTimeout(() => {selectionComputeNext(selectionSortState.FOR1BODYEND);},0));
			break;
		case selectionSortState.FOR2BODY:
			var color = 'green';

			if(tab[j] < tab[min])
			{
				color = 'red';
			}
			compare('<',color, document.getElementById('n' + j),document.getElementById('n' + min));
			if(tab[j] < tab[min])
			{
				let tmpMin = min;
				min = j;
				timeouts.push(setTimeout(() => {
					document.getElementById('n' + min).style.color = 'green';
					document.getElementById('n' + tmpMin).style.color = 'black';
				}, upliftSeconds * 1000));
				
			}
			let time = (upliftSeconds + 2*comparatorOpacityTransition + Math.max(comparatorOpacityTransition, upliftSeconds)) * 1000 + 10;
			timeouts.push(setTimeout(() => {selectionComputeNext(selectionSortState.FOR2END);},time));
			break;
		case selectionSortState.FOR2END:
			j++;
			timeouts.push(setTimeout(() => {selectionComputeNext(selectionSortState.FOR2START);},0));
			break;

		case selectionSortState.FOR1BODYEND:
			if( min != i)
			{
				let tmp = tab[i];
				tab[i] = tab[min];
				tab[min] = tmp;
				let time = (2 * upliftSeconds + Math.abs(i - min) * horizontalSpeedFactor)*1000 + 10;
				timeouts.push(setTimeout(() => {selectionComputeNext(selectionSortState.FOR1END);},time));
				swap(document.getElementById('n' + i),document.getElementById('n' + min));
			}
			else
				timeouts.push(setTimeout(() => {selectionComputeNext(selectionSortState.FOR1END);},0));
			break;

		case selectionSortState.FOR1END:
			document.getElementById('n' + i).style.color = 'black';
			i++;
			timeouts.push(setTimeout(() => {selectionComputeNext(selectionSortState.FOR1START);},0));
			break;

		}
}
//enum reprezentujacy maszyne stanow petli dla selectionSort oraz bubbleSort
var bubbleInsertionSortState = {
	FOR1INIT: 1,
	FOR1START: 2,
	FOR1BODY: 3,
	FOR2INIT:4,
	FOR2START: 5,
	FOR2BODY: 6,
	FOR2END: 7,
	FOR1END: 8
};

//algorytm realizujacy sortowanie babelkowe na podstawie przesylania danego stanu petli algorytmu
function bubbleComputeNext(state)
{
	switch (state) {
		case bubbleInsertionSortState.FOR1INIT:
			i = tab.length;
			timeouts.push(setTimeout(() => {bubbleComputeNext(bubbleInsertionSortState.FOR1START);},0));
			break;
		case bubbleInsertionSortState.FOR1START:
			if(i>1)
				timeouts.push(setTimeout(function() {bubbleComputeNext(bubbleInsertionSortState.FOR1BODY);},0));
			else
			{
				running = false;
				document.getElementsByClassName('arrayDiv')[0].style.border = "2px solid green";
				clearAllTimeouts();	
			}
			break;
		case bubbleInsertionSortState.FOR1BODY:
			timeouts.push(setTimeout(function() {bubbleComputeNext(bubbleInsertionSortState.FOR2INIT);},0));
			break;
		case bubbleInsertionSortState.FOR2INIT:
			j = 0;
			timeouts.push(setTimeout(function() {bubbleComputeNext(bubbleInsertionSortState.FOR2START);},0));
			break;
		case bubbleInsertionSortState.FOR2START:
			if(j < i-1)
				timeouts.push(setTimeout(function() {bubbleComputeNext(bubbleInsertionSortState.FOR2BODY);},0));
			else
				timeouts.push(setTimeout(function() {bubbleComputeNext(bubbleInsertionSortState.FOR1END);},0));
			break;
		case bubbleInsertionSortState.FOR2BODY:
			var color = 'green';
			let time = 0;

			if(tab[j] > tab[j+1])
			{
				color = 'red';
			}
			compareWithoutLifting('<',color, document.getElementById('n' + j),document.getElementById('n' + (j+1)));
			//compare time
			time += 3 * comparatorOpacityTransition * 1000;
			if(tab[j] > tab[j+1])
			{

				let tmp = tab[j];
				tab[j] = tab[j+1];
				tab[j+1] = tmp;
				timeouts.push(setTimeout(function() {swap(document.getElementById('n' + j),document.getElementById('n' + (j+1)));},time));
				//swap time distance always 1
				//time += upliftSeconds*2000 + 2 + 1000 + 5;
				time += (2 * upliftSeconds + 1 * horizontalSpeedFactor) * 1000 + 10;
			}
			timeouts.push(setTimeout(function() {bubbleComputeNext(bubbleInsertionSortState.FOR2END);},time));
			break;
		case bubbleInsertionSortState.FOR2END:
			j++;
			timeouts.push(setTimeout(function() {bubbleComputeNext(bubbleInsertionSortState.FOR2START);},0));
			break;

		case bubbleInsertionSortState.FOR1END:
			i--;
			timeouts.push(setTimeout(function() {bubbleComputeNext(bubbleInsertionSortState.FOR1START);},0));
			break;

	}
}


//algorytm realizujacy sortowanie przez wstawianie na podstawie przesylania danego stanu petli algorytmu
function insertionComputeNext(state)
{
	switch (state) {
		case bubbleInsertionSortState.FOR1INIT:
			i = 1;
			setTimeout(function() {insertionComputeNext(bubbleInsertionSortState.FOR1START);},0);
			break;
		case bubbleInsertionSortState.FOR1START:
			if(i<tab.length)
				setTimeout(function() {insertionComputeNext(bubbleInsertionSortState.FOR1BODY);},0);
			else
			{
				running = false;
				document.getElementsByClassName('arrayDiv')[0].style.border = "2px solid green";
				clearAllTimeouts();	
			}
			break;
		case bubbleInsertionSortState.FOR1BODY:
			setTimeout(function() {insertionComputeNext(bubbleInsertionSortState.FOR2INIT);},0);
			break;
		case bubbleInsertionSortState.FOR2INIT:
			j = i;
			setTimeout(function() {insertionComputeNext(bubbleInsertionSortState.FOR2START);},0);
			break;
		case bubbleInsertionSortState.FOR2START:
			if(j > 0)
			{
				setTimeout(function() {insertionComputeNext(bubbleInsertionSortState.FOR2BODY);},0);
			}
			else
				setTimeout(function() {insertionComputeNext(bubbleInsertionSortState.FOR1END);},0);
			break;
		case bubbleInsertionSortState.FOR2BODY:
			var color = 'green';
			let time = 0;

			if(tab[j-1] > tab[j])
			{
				color = 'red';
			}
			compareWithoutLifting('<',color, document.getElementById('n' + (j-1)),document.getElementById('n' + (j)));
			time += 3 * comparatorOpacityTransition * 1000;
			if(tab[j-1] > tab[j])
			{
				let tmp = tab[j];
				tab[j] = tab[j-1];
				tab[j-1] = tmp;

				//swap time distance always 1
				timeouts.push(setTimeout(function() {swap(document.getElementById('n' + (j-1)),document.getElementById('n' + j));},time));
				time += (2 * upliftSeconds + 1 * horizontalSpeedFactor) * 1000 + 10;
			}
			timeouts.push(setTimeout(function() {insertionComputeNext(bubbleInsertionSortState.FOR2END);},time));
			break;
		case bubbleInsertionSortState.FOR2END:
			j--;
			setTimeout(function() {insertionComputeNext(bubbleInsertionSortState.FOR2START);},0);
			break;

		case bubbleInsertionSortState.FOR1END:
			i++;
			setTimeout(function() {insertionComputeNext(bubbleInsertionSortState.FOR1START);},0);
			break;

	}
}


//enum reprezentujacy aktualnie wybrana metode sortowania
var sortingMethod = {
	BUBBLE_SORT: 1,
	INSERTIONSORT: 2,
	SELECTIONSORT: 3
};

//aktualne wybrana metoda sortowania
var selectedSortingMethod = 1;


//funkcja startujaca animacje;
function startSorting()
{
	stopSorting();
	upliftSeconds = comparatorOpacityTransition = horizontalSpeedFactor = document.getElementsByClassName("slider")[0].value / 100.0;

	running = true;
	if(tab == null)
		fillTabRandomly(5);
	switch(selectedSortingMethod)
	{
		case sortingMethod.BUBBLE_SORT:
			bubbleComputeNext(1);
			break;
		case sortingMethod.INSERTIONSORT:
			insertionComputeNext(1);
			break;
		case sortingMethod.SELECTIONSORT:
			selectionComputeNext(1);
			break;
	}
}

//funkcja stopujaca bierzaca animacje
function stopSorting()
{
	running = false;
	clearAllTimeouts();
	prepareArrayDiv();
	//setTimeout(function() {},0);
}

//funkcja obslugujaca keyboard event w obiekcie input, jesli zostal wcisniety enter to pobieramy dane
function checkIfEnter(e)
{
	var keyCode = (window.event) ? e.which : e.keyCode;
	if (keyCode == 13)
	{
		running = false;
		clearAllTimeouts();
		fillInputArray(document.getElementById('customizedArray').value);
	}
}

//funkcja podswietlajaca wybrana zakladke
function highlightTab(selectedId)
{
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(selectedId).style.display = "block";
	document.getElementById(selectedId).className += " active";
}

//funkcja ustawiajaca pole kodu na kod sortowania babelkowego
function bubbleCode()
{
	selectedSortingMethod = sortingMethod.BUBBLE_SORT;
	highlightTab('t1');
	document.getElementById('boldSorting').innerHTML = "Sortowanie bąbelkowe";
	document.getElementById('codeBlock').innerHTML = "BubbleSort(A)\n" +
	"1  n := length(A)\n" + 
	"2    do\n"+
	"3      for i := 1 to n-1\n"+
	"4        if A[i] > A[i+1] then\n"+
	"5          swap(A[i], A[i+1])\n"+
	"6      n := n-1\n"+
	"7    while n > 1\n"+
	"8  end procedure";
}

//funkcja ustawiajaca pole kodu na kod sortowania przez wybieranie
function selectionCode()
{
	selectedSortingMethod = sortingMethod.SELECTIONSORT;
	highlightTab('t3');
	document.getElementById('boldSorting').innerHTML ="Sortowanie przez wybieranie";
	document.getElementById('codeBlock').innerHTML ="SelectionSort(A)\n"+
	"1  n := length(A)\n"+
	"2  for i := 1 to n\n"+
	"3     min := i\n"+
	"4     for j := i+1 to n\n"+
	"5        if A[j] < A[min]\n"+
	"6           min := j\n"+
	"7     swap A[i] with A[j]\n"+
	"8  end procedure";
}

//funkcja ustawiajaca pole kodu na kod sortowania przez wstawianie
function insertionCode()
{
	selectedSortingMethod = sortingMethod.INSERTIONSORT;
	highlightTab('t2');
	document.getElementById('boldSorting').innerHTML ="Sortowanie przez wstawianie";
	document.getElementById('codeBlock').innerHTML = "InsertionSort(A)\n"+
	"1  i := 1\n"+
	"2  while i < length(A)\n"+
	"3      j := i\n"+
	"4      while j > 0 and A[j-1] > A[j]\n"+
	"5          swap A[j] and A[j-1]\n"+
	"6          j := j - 1\n"+
	"7      i := i + 1\n"+
	"8  end procedure";
}