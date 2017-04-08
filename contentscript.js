var search={};
var searchResults="";
var searchIds=[];
// traverses the search page and gets questionIds which will be used for further traversal
search.getSearchLinks=function()
{
	return {
			searchLinks:function()
		{
			searchResults=document.getElementsByClassName('question-summary search-result');
			var searchLinks={};
			for (i=0;i < searchResults.length; i++)
			{
				var idOfElement= searchResults[i].getAttribute("id");
				var votes= searchResults[i].getElementsByClassName("vote-count-post")[0].childNodes[0].innerHTML;
				var  tagsList= searchResults[i].getElementsByClassName("post-tag");
				var isJava=false;	
				if (tagsList.length >0 )
				{
					for(j=0;j<tagsList.length;j++)
					{
						if(tagsList[j].innerHTML=="java")
						{
							isJava=true;
							break;
						}	
					}
				}
				if (isJava== true)
				{
					 var div =searchResults[i].getElementsByClassName("result-link")[0];
					 var span=div.getElementsByTagName("span")[0];
					 var url=span.getElementsByTagName("a")[0];
					 searchResults[idOfElement]=url;
					 searchIds.push(idOfElement);
				}
			}
		}
	}
}();

// finds code elements on the page for chosen answer and returns code fragment to be summarized
function GetCodeFragment(newDocument)
{
	var answers= newDocument.querySelectorAll("[itemtype='http://schema.org/Answer']");
	var answersIds=[];
	for(k=0;k<answers.length;k++)
	{
		var idOfanswer= answers[k].getAttribute("data-answerid");
		answersIds.push(idOfanswer);
		var codefragment=[];
		var code=answers[k].getElementsByTagName("code");
		if(code.length > 0 )
		{
			for(j=0;j<code.length;j++)
			{
					codefragment.push(code[j].innerText);
			}
			break;
		}
		
	}
	return codefragment;
};


// to parse a string obtained into valid HTML object
function HTMLParser(aHTMLString){
var hid = document.body.appendChild(document.createElement("div"));
hid.style.display = "none";
hid.innerHTML = aHTMLString;
  return hid;
};

// traverse the links returned by function searchLinks()
function traversePageToGetSummary(searchResults,ids)
{
	var i=0;
	for(i=0;i<ids.length;i++)
	{
		TraversingSOPage(ids[i]);
	}
};

function TraversingSOPage(id)
{
	$.get(searchResults[id],function(data){
			var fragment=GetCodeFragment(HTMLParser(data));
			if(fragment!==null && fragment.length >0)
			GetResultFromKonaila(fragment,id);
		});
};

// getting result from Konaila and replacing them with original answers on SO page
function GetResultFromKonaila(codefragment,questionId)
{
	
	var url_summarizer="http://annieying.ca:8847/FirstTwoLinesSummarizer";
	var params="code="+codefragment+"&format=text&line-length=20";
	
	$.ajax({
		type :"POST",
		url:url_summarizer,
		data : params,
		success : function(response)
		{
			console.log(response);
				var div=document.getElementById(questionId);
				// this snippet will replace the existing DOM with results obtained from Konaila
				if(div!==null && div !=undefined)
				{
				div.getElementsByClassName("excerpt")[0].innerHTML=response;
				}
		}
	});
		
};

// collects all valid answerIDs which needs to be traversed
searchLinks=search.getSearchLinks.searchLinks();
//traverses the pages to get code summaries from Konaila
traversePageToGetSummary(searchResults,searchIds);




