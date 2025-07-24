
const bash_1 = `#!/bin/bash

if [ $# -eq 0 ]
  then
    echo "Script to split video files into chunks based on .srt timecodes"
    echo ""
    echo "usage: srt-split.sh [video file] (optional)[output format]"
    echo "If no output format is supplied, cut files will be saved in the same format as the original file."
    exit 0
fi

fileToCut=$1
format=$2

fileName=$(basename "$fileToCut")
fileExt="\u0024{fileName##*.}"
fileName="\u0024{fileName%.*}"

if [ ! -f "$fileToCut" ]
then
  echo "ERR: no file found at $fileToCut"
  echo "usage: srt-split.sh [video file] (optional)[output format]"
  exit 1
fi

echo "Ready to start cutting."
echo ""

# Make directory to store output clips
mkdir "$fileName-clips"

# loop through the arrays created autoly and cut each clip with ffmpeg
`,
    bash_2 = `
arrayLength=\u0024{#startTimeForFfmpeg[@]}
numOfClips=\`expr $arrayLength\`
exportErrorOccured=false

for k in \`seq -w \u0024{arrayLength}\`
do
  j=\`expr $k - 1\`
  # if user specified audio, use that for the output, if not use mp4 format
  echo -n "Cutting segment no. \u0024{k} of \u0024{numOfClips} and exporting to \u0024{format}..."
  if [ "$format" = "mp3" ]
  then
`,
    bash_3 = `
  fi
  if [ $? -eq 0 ]; then
    echo OK
  else
    echo ERR
    exportErrorOccured=true
  fi
done

if [ "$exportErrorOccured" = false ]; then
  echo "Finished. Files are available in $PWD/$fileName-clips"
else
  echo "There were errors with the ffmpeg processing. Please see log above."
fi`,
    bat_1 = `REM By: flashlab
REM Description: video spliter
REM Version: 1.0
REM License: The MIT License (MIT)
@echo off

cd /d "%~dp0"

SET "input="
SET "output="
SET "overwrite="
SET "format=mp4"

SET input=%~1
SET base_folder=%~dp1
SET base_name=%~n1
SET base_ext=%~x1

SHIFT

IF "%input%" == "" (
    ECHO Video spliter v1.0.0 ^(C^) 2020, flashlab
    ECHO This tools use of ffmpeg here: http://ffmpeg.zeranoe.com/builds
    ECHO.
    ECHO Usage: videosplit SOURCE_FILE [OPTIONS]
    ECHO.
    ECHO Options:
    ECHO   SOURCE_FILE      Source video file name for convert
    ECHO                    also you can drag and drop source video file to this batch file directly
    ECHO   -o               Output folder
    ECHO                    if not set it, use [FILENAME-clips]
    ECHO   -y               Overwrite destination file
    ECHO                    if not set it, appears prompt for overwrite destination file
    ECHO   -t               output format
    ECHO                    if not set it, cut files will be saved in the same format as the original file
    GOTO :EOF
)

:loop
IF NOT "%~1"=="" (
    IF "%~1"=="-o" SET "output=%~2" & SHIFT
    IF "%~1"=="-t" SET "format=%~2" & SHIFT
    IF "%~1"=="-y" SET "overwrite=-y"
    SHIFT
    GOTO :loop
)

if "%output%"=="" SET "output=%base_folder%%base_name%-clips\\"
if NOT exist %output% md %output%
`,
    bat_2 = `
IF NOT EXIST "%outputFile%" ECHO Failed to generate video file.
ECHO Done.
PAUSE`,
realbash = '';
window.bm = {};
window.subArr = {};
window.starT = [];
window.durT = [];
window.newmark = [];
window.manual = false;
window.undo = [];
window.bookmarks = '{"bookmarks":[]}';

const StringToColor = (function(){
    var instance = null;

    return {
    next: function stringToColor(str) {
        if(instance === null) {
            instance = {};
            instance.stringToColorHash = {};
            instance.nextVeryDifferntColorIdx = 0;
            instance.veryDifferentColors = ['#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FE4365', '#FC9D9A', '#F9CDAD', '#C8C8A9', '#83AF9B', '#ECD078', '#D95B43', '#C02942', '#542437', '#53777A', '#CFF09E', '#A8DBA8', '#79BD9A', '#3B8686', '#0B486B', '#556270', '#4ECDC4', '#C7F464', '#FF6B6B', '#C44D58', '#774F38', '#E08E79', '#F1D4AF', '#ECE5CE', '#C5E0DC', '#E8DDCB', '#CDB380', '#036564', '#033649', '#031634', '#D1F2A5', '#EFFAB4', '#FFC48C', '#FF9F80', '#F56991', '#490A3D', '#BD1550', '#E97F02', '#F8CA00', '#8A9B0F', '#594F4F', '#547980', '#45ADA8', '#9DE0AD', '#E5FCC2', '#00A0B0', '#6A4A3C', '#CC333F', '#EB6841', '#EDC951', '#E94E77', '#D68189', '#C6A49A', '#C6E5D9', '#F4EAD5', '#3FB8AF', '#7FC7AF', '#DAD8A7', '#FF9E9D', '#FF3D7F', '#D9CEB2', '#948C75', '#D5DED9', '#7A6A53', '#99B2B7'];
        }

        if(!instance.stringToColorHash[str])
            instance.stringToColorHash[str] = instance.veryDifferentColors[instance.nextVeryDifferntColorIdx++];

            return instance.stringToColorHash[str];
        }
    }
})();

(function(){
  try {
    ipa = Comlink.wrap(new Worker('worker.js'));
  } catch (e) {
    alert('注音服务无法启动，请检查网络并刷新！')
  }
})();

upload.addEventListener('change', () => {
  const files = upload.files;
  Object.keys(files).forEach(i => {
    (function(file) {
      const type = file.name.split('.').pop();
      switch (type) {
        case 'srt':
          icon_srt.style.background = '#57bb8a';
          readFile(file, type)
          break;
        case 'bookmarks':
          if (cb3.checked) break;
          icon_bm.style.background = '#57bb8a';
          readFile(file, type);
          break;
        case 'mkv':
        case 'mp4':
        case 'aac':
        case 'mp3':
          window.vsrc = vid.src = window.URL.createObjectURL(file);
          break;
        case 'sh':
        case 'bat':
          readFile(file, type);
          icon_bm.style.background = '#57bb8a';
          break;
        default:
          upload.setCustomValidity("Invalid field");
      }
    })(files[i])
  })
})

cb3.addEventListener('change', e => {
  document.querySelector('.file-dummy>.default>span').classList.toggle('hide')
  if (e.target.checked) {
    window.bookmarks = '{"bookmarks":[]}'
  } else {
    window.bookmarks = null
  }
})
cb4.addEventListener('change', e => {
  if (e.target.checked) {
    flashArr();
    parseIPA()
  } else {

  }
})
document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && event.key === 'z' && window.undo.length > 0) {
    var undoItem = window.undo.pop();
    undoItem.node.textContent = undoItem.text
  }
})
function readFile(file, type) {
  window['fname'] = file.name.split('.').shift();
  const reader = new FileReader();
  reader.onload = (e) => {
    window[type] = reader.result;
    if (window.bookmarks) {
      parseSRT(Subtitle.parse(window.srt), JSON.parse(window.bookmarks).bookmarks);
    } else if (window.sh || window.bat) {
      let contents = window.sh || window.bat;
      if (contents.match(/(?:startTimeForFfmpeg=)(.*?)$/m)) {
        starT = contents.match(/(?<=startTimeForFfmpeg=\()[0-9\.\s]+/m)[0].split(' ');
        durT = contents.match(/(?<=timeDiff=\()[0-9\.\s]+/m)[0].split(' ');
        let marks = contents.match(/(?:bookmarks=|##\s)(.*?)$/m);
        if (marks) {
          window['bookmarks'] = '{"bookmarks":' + marks[1] + '}';
          parseSRT(Subtitle.parse(window.srt), JSON.parse(marks[1]), false);
          return
        }
        let subTxt = contents.match(/(?:subTXT=)(.*?)$/m);
        if (subTxt) {
          subArr = JSON.parse(subTxt[1]);
          let timelines = '',
               editable = window.confirm('是否可修改？');
          Object.keys(subArr).forEach((k, i) => {
            startTime = parseFloat(starT[i]);
            durTime = parseFloat(durT[i]);
            endTime = (startTime*1000 + durTime*1000)/1000;
            timelines += `<li${(i&1) ? ' class="timeline-inverted"' : ''}><div class="timeline-badge" onclick="expandMe(event)" style="height: ${durTime<120 ? 50*durTime/120 : 5}px"></div><div class="timeline-panel"><div class="timeline-heading" data-clip="${startTime}"><h4 onclick="clip(event)">${k}</h4><i onclick="copyVTT(this)"></i></div><div class="timeline-body">${editable ? '<textarea>'+subArr[k]+'</textarea>' : '<p>'+subArr[k].split(/\n+/g).join('</p><p>')+ '</p>'}</div><div class="timeline-footer" data-clip="${endTime-2},${endTime}"><p onclick="clip(event)" class="time">${Subtitle.toVttTime(durTime*1000)}</p><i onclick="copyTXT(event)"></i></div></div></li>`;
          });
          timeline.innerHTML = timelines + '<li class="clearfix no-float"></li>'
        }
      }

    } else { return upload.setCustomValidity("Invalid field") }
    upload.setCustomValidity("")
  }
  reader.readAsText(file);
}

function parseSRT(srtobj, bookmark, initRange=true) {
  if (!srtobj.length) return alert('先上传SRT!!')
  bm = {};
  lastchecked=null;
  let srtList = [],
    timelines = '',
    timepad = null;
  timepad = parseInt(window.prompt('输入偏移值[毫秒]，如"-1000", 输入"0"精确裁切', ''))
  if (timepad) {
    srtobj = Subtitle.resync(srtobj, timepad)
  }
  subtrack.src = URL.createObjectURL(new Blob([Subtitle.stringifyVtt(srtobj)], {type: 'text/plain'}))
  for (var i=0; i<srtobj.length; i++) {
    srtList.push([[], i, Subtitle.toVttTime(srtobj[i].start)+' - '+Subtitle.toVttTime(srtobj[i].end), srtobj[i].text])
  }
  for (let item of bookmark) {
    const name = item.txt;
    bm[name] = bm[name] || []
    srtobj[item.idx]['oridx'] = item.idx
    bm[name].push(srtobj[item.idx])
    srtList[item.idx][0].push(name)
  }
  panel_srt.innerHTML = `<ul id="li_srt">\n${srtList.reduce((t,v,i)=>{
    return t + `<li><input type="checkbox" value="${v[1]}"><label>${v[0].reduce((m,n)=>{
      return m + `<a class="btn" style="background:${StringToColor.next(n)}" href="#${n}">${n}</a>`
    },'')}<a class="time">${v[2]}</a>${v[3]}</label></li>\n`
  },'')}</ul>`;
  // bind srt lists
  let srt_inputs = document.querySelectorAll('#li_srt input');
  for (var s of srt_inputs) {
    s.addEventListener('click', e => {
      let inBtw = false;
      if (e.shiftKey && e.target.checked) {
        for (var trs of srt_inputs) {
          if (trs === e.target || trs === lastchecked) inBtw = !inBtw;
          if (inBtw) trs.checked = true
        }
      }
      window.lastchecked = e.target
    })
  }
  // generate ffmpeg parm and timelines
  if (initRange) {
    starT = [];
    durT = [];
  }
  Object.keys(bm).sort((a, b) => a - b).forEach((k, i) => {
    ((key, item, index) => {
      item.sort((a, b) => a.start - b.start);
      let startTime = 0,
          endTime = 0;
      if (starT.length <= index) {
        let offsetL = 0,
            offsetR = 0;
        if (timepad !== 0) {
          if (item[0]['oridx']>0) {
            let temp_offsetL = item[0].start - srt[item[0]['oridx']-1]['end'] - 200;
            offsetL = temp_offsetL < 1000 ? (temp_offsetL < 200 ? 500 : temp_offsetL) : 1000;
          }
          if (item[item.length-1]['oridx']<srt.length-1) {
            let temp_offsetR = srt[item[item.length-1]['oridx']+1]['start'] - item[item.length - 1].end - 200;
            offsetR = temp_offsetR < 2000 ? (temp_offsetR < 500 ? 1000 : temp_offsetR) : 2000;
          }
        }
        startTime = (item[0].start - offsetL)/1000;
        endTime = (item[item.length - 1].end + offsetR)/1000;
        durTime = (endTime*1000 - startTime*1000)/1000;
        starT.push(startTime.toFixed(3));
        durT.push(durTime.toFixed(3));
      } else {
        startTime = parseFloat(starT[index]);
        durTime = parseFloat(durT[index]);
        endTime = (startTime*1000 + durTime*1000)/1000
      }
      timelines += `<li${(index&1) ? ' class="timeline-inverted"' : ''}><div class="timeline-badge" onclick="expandMe(event)" style="height: ${durTime<120 ? 50*durTime/120 : 5}px"></div><div class="timeline-panel"><div class="timeline-heading" data-clip="${startTime}"><h4 onclick="clip(event)">${key}</h4><i onclick="copyVTT(this)"></i></div><div class="timeline-body">${item.reduce((t,v,n)=>{
          return t + `<p>${v.text}</p>`
        },'')}</div><div class="timeline-footer" data-clip="${endTime-2},${endTime}"><p onclick="clip(event)" class="time">${Subtitle.toVttTime(durTime*1000)}</p><i onclick="copyTXT(event)"></i></div></div></li>`;
    })(k, bm[k], i)
  });
  timeline.innerHTML = timelines + '<li class="clearfix no-float"></li>';
  if (cb4.checked) parseIPA();
}

function doclick(el) {
  let wm_input = cb1.checked ? `-i "${png_input.value}" ` : '',
      head_input = cb2.checked ? `-i "${pre_input.value}" ` : '',
      mark_input= '',
      filter_complex = '';
  flashArr();
  if (Object.keys(bm).length) {
    mark_input = 'bookmarks=' + JSON.stringify(window.newmark.length ? window.newmark : JSON.parse(window.bookmarks).bookmarks)
  } else if (Object.keys(subArr).length) {
    mark_input = 'subTXT=' + JSON.stringify(subArr)
  } else {
    return
  }
  if (cb1.checked) {
    filter_complex = cb2.checked ? '-filter_complex "[1:v]scale=640:360,setsar=1[v1];[v1][2]overlay=x=(main_w-overlay_w-10):y=10[v2];[0][0:a][v2][1:a]concat=n=2:v=1:a=1[v][a]" -map [v] -map [a] -vsync 2 ' : '-filter_complex "overlay=x=(main_w-overlay_w-10):y=10" '
  } else if (cb2.checked) {
    filter_complex = '-filter_complex "[1:v]scale=640:360,setsar=1[v1];[0][0:a][v1][1:a]concat=n=2:v=1:a=1[v][a]" -map [v] -map [a]  -vsync 2 '
  }

  let data = new Blob([(el=='sh' ? bash_1 + `## ${mark_input}\n` + `startTimeForFfmpeg=(${starT.join(' ')})\n` +
    `timeDiff=(${durT.join(' ')})` +
    bash_2 + `ffmpeg -v warning -stats -vn -dn -ss "\u0024{startTimeForFfmpeg[j]}" -t "\u0024{timeDiff[j]}" -i "$fileToCut" -codec:a libmp3lame "$fileName-clips/$fileName-\u0024{k}.mp3"\nelse\nffmpeg -v warning -stats ${head_input}-ss "\u0024{startTimeForFfmpeg[j]}" -t "\u0024{timeDiff[j]}" -accurate_seek -i "$fileToCut" ${wm_input}${filter_complex}-sn -dn -map_chapters -1 -vcodec libx264 -acodec aac -movflags +faststart "$fileName-clips/$fileName-\u0024{k}.mp4"` +
    bash_3 : (starT.reduce((t, v, i) => {
    return t + `ECHO Cutting segment no. ${i+1} of ${durT.length} and exporting to %format%...\n` +
      `SET outputFile=%output%%base_name%-${i}.%format%\nif "%format%"=="mp3" ` +
      `(ffmpeg.exe -v warning -stats -vn -dn -ss "${v}" -t "${durT[i]}" -i "%input%" %overwrite% -codec:a libmp3lame "%outputFile%") ELSE ` +
      `(ffmpeg.exe -v warning -stats ${head_input}-ss "${v}" -t "${durT[i]}" -accurate_seek -i "%input%" ${wm_input}${filter_complex}-sn -dn -map_chapters -1 -vcodec libx264 -acodec libmp3lame -movflags +faststart %overwrite% "%outputFile%")\n`
  }, bat_1) + bat_2 + `\n:: ${mark_input}\n` + `:: startTimeForFfmpeg=(${starT.join(' ')})\n` +
    `:: timeDiff=(${durT.join(' ')})`).replace(/\r?\n/g, '\r\n'))], { type: 'text/plain' }),
    url = window.URL.createObjectURL(data),
    ele = document.createElement('a');
    ele.href = url;
    ele.download = window.fname + '.' + el;
    document.body.appendChild(ele);
    ele.click();
    document.body.removeChild(ele)
}

async function parseIPA() {
  if (window.confirm('是否手动注音？')) return window.manual = true;
  var tar = timeline.querySelectorAll(".timeline-body"),
    progress = ipaboard.querySelector("span");
  if (ipaboard.style.display == 'block') return;
  ipaboard.style.display = 'block';
  for (var i = 0; i < tar.length; i++) {
    if (tar[i].classList.contains('ipa')) continue;

    realIPA(tar[i])
    progress.innerHTML = `${i+1}/${tar.length}`;
  }
  changeTrans(cb5.selectedIndex)
  ipaboard.style.display = 'none';
}

function selectText(node) {
    if (document.body.createTextRange) {
        const range = document.body.createTextRange();
        range.moveToElementText(node);
        range.select();
    } else if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        console.warn("Could not select text in node: Unsupported browser.");
    }
}

function changeTrans(n) {
  let tar = timeline.getElementsByClassName("timeline-body");
  if (!tar.length || tar[0].firstElementChild.tagName == "TEXTAREA") return;
  switch (n) {
    case 0:
      let transl = timeline.getElementsByClassName('istrans');
      while (transl.length > 0) {
        transl[0].classList.remove('istrans', 'hide')
      }
      break;
    case 1:
      for (var i = 0; i < tar.length; i++) {
        let p = tar[i].children;
          for (var j = 1; j < p.length; j+=2) {
            p[j].classList.add("istrans");
            p[j].classList.remove("hide")
          }
      }
      break;
    case 2:
      let trans = timeline.getElementsByClassName("istrans");
      if (trans.length == 0) {
        for (var i = 0; i < tar.length; i++) {
          let p = tar[i].children;
            for (var j = 1; j < p.length; j+=2) {
              p[j].classList.add("istrans", "hide")
            }
        }
      } else {
        for (var i = 0; i < trans.length; i++) {
          trans[i].classList.add('hide')
        }
      }
      break;
    case 3:
      for (var i = 0; i < tar.length; i++) {
        if (tar[i].classList.contains('ipa')) continue;
        let p = tar[i].children;
          for (var j = 0; j < p.length; j++) {
            p[j].outerHTML = p[j].textContent.split('\n',2).reverse().reduce((t,v)=>{
              return t + `<p>${v}</p>`
            },'')
          }
      }
  }
}

function copyTXT(e) {
  let txtBody = e.target.parentNode.previousElementSibling,
      node = txtBody.cloneNode(true),
      convStr = '';
  // if (node.getElementsByTagName('ruby').length == 0) return navigator.clipboard.writeText(node.innerHTML);
  if (node.classList.contains('ipa')) {
    // remove rt editor
    for (var sel of node.querySelectorAll('select')) {
      sel.outerHTML = `/${sel.options[sel.selectedIndex].text}/`
    }
    for (var ipt of node.querySelectorAll('input')) {
      ipt.outerHTML = ipt.value
    }
    // remove empty <rt>
    for (var rt of node.querySelectorAll('rt')) {
      if (!rt.textContent) {
        try {
          rt.previousElementSibling.remove();
          rt.nextElementSibling.remove()
        } catch(e){};
        rt.remove()
      }
    }
    // remove empty <ruby> tag
    for (var ru of node.querySelectorAll('ruby')) {
      if (!ru.children.length) {
        ru.outerHTML = ru.textContent
      }
    }
    // remove <rp> tag
    if (!e.ctrlKey) {
      for (var rp of node.querySelectorAll('rp')) {
        rp.remove()
      }
    }
    if (e.shiftKey) {
      for (var p of node.querySelectorAll('p')) {
        let rawTxt = p.innerHTML.match(/(?<=<ruby>).*?(?=<)/g);
        if (!rawTxt) continue;
        convStr += `<span style="color: #9C27B0">${rawTxt.join(' ')}</span>`;
        convStr += `<br><span style="color: gray">${p.innerHTML.match(/(?<=<rt>).*?(?=<\/rt>)/g).join(' ')}</span><br><br>`
      }
      node.innerHTML = convStr
    } else if (e.altKey) {
      var elem = document.createElement('div');
      elem.appendChild(document.createTextNode(node.innerHTML));
      node.innerHTML = elem.innerHTML
    } else {
      for (var sel of node.querySelectorAll('ruby')) {
        sel.parentNode.classList.add('rubyline')
        sel.outerHTML = sel.outerHTML.replace(/ruby>/g, "span>").replace(/rp>/g, "span>");
      }
      for (var ru of node.querySelectorAll('.rubyline')) {
        ru.outerHTML = ru.outerHTML.replace(/<\/p>/g, '<\/span>').replace(/<p[^>]+>/g, '<span style="color: rgb(230,0,0)">');
      }
    }
  } else if (node.firstElementChild.tagName == "TEXTAREA") {
    node.innerHTML = `<p>${node.firstElementChild.value.split(/\n+/g).join('</p><p>')}</p>`
  } else {
    for (var tr of node.querySelectorAll('.istrans')) {
      tr.outerHTML = tr.outerHTML.replace(/<\/p>/g, '<\/span>').replace(/<p[^>]+>/g, '<span style="color: gray">') + '<br/><br/>'
    }
    for (var ll of node.querySelectorAll('p')) {
      ll.outerHTML = ll.outerHTML.replace(/<\/p>/g, '<\/span>').replace(/<p[^>]*>/g, '<span style="color: rgb(230,0,0)">') + '<br>'
    }
  }
  let popText = '<div class="popText">'+node.outerHTML+'<span class="popup-btn-close" onclick="this.parentNode.remove()">X</span></div>'
  txtBody.parentNode.insertAdjacentHTML('beforeend', popText);
  selectText(txtBody.parentNode.lastChild)
}
function copyVTT(e) {
  var vtt = Subtitle.stringifyVtt(Subtitle.resync(bm[e.previousElementSibling.textContent], -parseFloat(e.parentNode.dataset.clip)*1000));
  navigator.clipboard.writeText(vtt)
}

async function expandMe(e) {
  let currList = e.target.parentNode,
      trueText = e.target.nextElementSibling.children[1],
      allList = currList.parentNode.children,
      idx = [].indexOf.call(allList, currList) + 1;
  if (e.shiftKey && allList.length > 1 && window.confirm('是否删除？')) {
    for (var i = idx; i < allList.length; i++) {
      allList[i].classList.toggle('timeline-inverted')
    }
    currList.remove();
  } else if (e.altKey) {
    let vname = window.prompt('输入标签', '');
    if (!vname) return;
    for (var i = idx; i < allList.length; i++) {
      allList[i].classList.toggle('timeline-inverted')
    }
    let startTime = window.vsrc ? vid.currentTime : 0;
    currList.insertAdjacentHTML('afterend', `<li${(currList.classList.contains('timeline-inverted')) ? '' : ' class="timeline-inverted"'}><div class="timeline-badge" onclick="expandMe(event)" style="height: 5px"></div><div class="timeline-panel"><div class="timeline-heading" data-clip="${startTime}"><h4 onclick="clip(event)">${vname}</h4><i onclick="copyVTT(this)"></i></div><div class="timeline-body"><textarea></textarea></div><div class="timeline-footer" data-clip="${startTime},${startTime+2}"><p onclick="clip(event)" class="time">${Subtitle.toVttTime(2000)}</p><i onclick="copyTXT(event)"></i></div></div></li>`)
  } else {
    trueText.classList.toggle('expand');
    e.target.classList.toggle('expand');
    if (window.manual && !trueText.classList.contains('ipa')) {
      realIPA(trueText);
      changeTrans(cb5.selectedIndex)
    }
  }
}

function flashArr() {
  let tar = timeline.querySelectorAll(".timeline-panel");
  starT = [];
  durT = [];
  subArr = [];
  for (var i = 0; i < tar.length; i++) {
    let panel = tar[i].children;
    starT.push(parseClip(panel[0]));
    durT.push((parseClip(panel[2])*1000-parseClip(panel[0])*1000)/1000);
    subArr.push((panel[1].firstElementChild.tagName == "TEXTAREA") ? panel[1].firstElementChild.value : panel[1].firstElementChild.innerText)
  }
}  

async function realIPA(el) {
  let convertHTML = (el.firstElementChild.tagName == "TEXTAREA") ? el.firstElementChild.value : el.innerText;
  try {convertHTML = await ipa.convert(convertHTML)}catch(e){return console.log('ipa fail:', e.message)}
  if (/<ruby>/.test(convertHTML)) el.classList.add('ipa');
  el.innerHTML = convertHTML;
  var rt = el.querySelectorAll('rt');
  for (var i = 0; i < rt.length; i++) {
    rt[i].addEventListener('click', e => {
      var _this = e.target;
      var oldRT = _this.textContent;
      if (e.shiftKey) {
        window.undo.push({node:_this, text:oldRT});
        _this.textContent = ""
      } else if (e.altKey) {
        window.undo.push({node:_this, text:oldRT});
        _this.textContent = "";
        editor = document.createElement('input');
        editor.type = "text";
        editor.value = oldRT;
        editor.size = oldRT.length;
        _this.appendChild(editor);
        editor.addEventListener('blur', e => {
          _this.textContent = e.target.value;
          e.target.remove()
        })
      }
    })
  }
  return
}

function toggleSRT() {
  if (panel_srt.classList.toggle('in')) {
  } else {
    if (!(window.srt) || !(window.newmark.length) || !(window.confirm('是否保存？'))) return;
    parseSRT(Subtitle.parse(window.srt), window.newmark, false);
  }
}
function saveMark() {
  if (window.bookmarks !== '{"bookmarks":[]}') return
  let vname = window.prompt('输入标签,留空清除选中状态；若无选中清除输入标签', '')
  switch (vname) {
    case null:
      return;
    case "":
      for (var sel of document.querySelectorAll('#li_srt input:checked')) {
        sel.checked = false
      }
      break;
    default:
      tags = document.querySelectorAll('#li_srt .btn');
      window.newmark = [];
      for (var i=0; i<tags.length; i++) {
        if (tags[i].innerText == vname) {
          tags[i].remove();
          continue
        };
        window.newmark.push({"idx": parseInt(tags[i].parentNode.previousElementSibling.value), "txt": tags[i].innerText})
      }
      for (var sel of document.querySelectorAll('#li_srt input:checked')) {
        window.newmark.push({"idx": parseInt(sel.value), "txt": vname}) 
        sel.nextElementSibling.insertAdjacentHTML('beforeend', `<a class="btn" style="background:${StringToColor.next(vname)}" href="#${vname}">${vname}</a>`)
        sel.checked = false
      }
  }
}

function clip(e) {
  let tar = e.target.parentNode,
      idx = [].indexOf.call(tar.parentNode.parentNode.parentNode.children, tar.parentNode.parentNode),
      isHead = tar.classList.contains('timeline-heading'),
      stamp = '',
      panel = tar.parentNode.children;
  if (e.shiftKey) {
    let sta = parseFloat(starT[idx]),
        dur = parseFloat(durT[idx]);
    stamp = parseFloat(prompt('输入[ '+(isHead ? '起始' : '结束')+' ]时间:', parseClip(tar)));
  } else if (e.altKey) {
      stamp = vid.currentTime
  }
  if (stamp) tar.dataset.clip = isHead ? `${stamp.toFixed(3)}` : `${(stamp-2).toFixed(3)},${stamp.toFixed(3)}`;
  tar.parentNode.querySelector('.time').innerText = Subtitle.toVttTime(parseClip(panel[2])*1000-parseClip(panel[0])*1000)
  if (!window.vsrc) return;
  vid.src = window.vsrc + '#t=' + tar.dataset.clip;
  vid.load();
  vid.play();
}

function parseClip(e) {
  return parseFloat(e.dataset.clip.split(',').pop())
}
