// Created by spades<spadesge@gmail.com> on 18/04/16

let Data = new Array(16)
const containerEle = document.getElementsByClassName('container')[0]
const scoreEle = document.getElementById('score')

/**
 * 生成随即索引，确定随机出现新数值的位置
 * @returns {*}
 */
function randomIndex() {
    let index
    do {
        index = Math.floor(Math.random() * 16)
    } while (Data[index])
    return index
}

/**
 * 随机出现数值，2或者4
 * @returns {number}
 */
function randomData() {
    const dataArr = [2, 4]
    return dataArr[Math.floor(Math.random() * 2)]
}

/**
 * 重绘格子区域
 */
function repaint() {
    let innerHTML = ''
    for (let i = 0; i < Data.length; i++) {
        if (i % 4 === 0) {
            innerHTML += '<div class="row">'
        }
        if (Data[i]) {
            innerHTML += `<div class="cell lv${Data[i]}">${Data[i]}</div>`
        } else {
            innerHTML += `<div class="cell "></div>`
        }
        if (i % 4 === 3) {
            innerHTML += '</div>'
        }
    }
    containerEle.innerHTML = innerHTML
}

/**
 * 计算得分
 */
function score() {
    const result = Data.reduce((accumulator, currentValue) => {
        return accumulator + currentValue
    })
    scoreEle.innerText = result
}

/**
 * 游戏初始化
 */
function init() {
    Data = new Array(16)
    Data[randomIndex()] = randomData()
    Data[randomIndex()] = randomData()
    scoreEle.innerText = 0
    repaint()
}

/**
 * 将16个格子中数据按行或者列分类
 * @param isRow
 * @returns {[null,null,null,null]}
 */
function getRowsOrColumns(isRow = true) {
    const classifyArr = [new Array(0), new Array(0), new Array(0), new Array(0)]
    Data.filter((item, index) => {
        let condition = index % 4
        if (isRow) {
            condition = Math.floor(index / 4)
        }
        switch (condition) {
            case 0:
                classifyArr[0].push(item)
                break
            case 1:
                classifyArr[1].push(item)
                break
            case 2:
                classifyArr[2].push(item)
                break
            case 3:
                classifyArr[3].push(item)
                break
            default:
                break
        }
    })
    return classifyArr
}

/**
 * 失败判断
 */
function isFailing() {
    const flag = (Data.filter(item => item).length < 16)
    if (flag) {
        return
    }
    const columns = getRowsOrColumns(false)
    const rows = getRowsOrColumns()
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < columns[i].length - 1; j++) {
            if (columns[i][j] === columns[i][j + 1] && columns[i][j]) {
                return
            }
        }
        for (let k = 0; k < rows[i].length - 1; k++) {
            if (rows[i][k] === rows[i][k + 1] && rows[i][k]) {
                return
            }
        }
    }
    alert('挑战失败!')
    init()
}

/**
 * 新生成一个格子
 */
function addOne() {
    Data[randomIndex()] = randomData()
    score()
}


init()

/**
 * 执行移动操作
 * @param isHorizontal  是否为水平移动
 * @param hasToReverse  在数据重排序过程中是否要反转，默认向上、向左为顺序不用反转；向下、向右需要反转
 */
function move(isHorizontal = true, hasToReverse = false) {
    let toAdd = false
    let isSuccessful = false
    const DataToString = Data.join()
    const items = getRowsOrColumns(isHorizontal)
    for (let i = 0; i < 4; i++) {
        if (hasToReverse) {
            items[i].reverse()
        }
        for (let j = 0; j < items[i].length - 1; j++) {
            if (items[i][j] === items[i][j + 1] && items[i][j]) {
                items[i][j + 1] *= 2
                items[i].splice(j, 1)
                isSuccessful = (items[i][j] === 2048)
                toAdd = true
            }
        }
    }
    Data = new Array(16)
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < items[i].length; j++) {
            if (isHorizontal) {
                if (hasToReverse) {
                    Data[(i * 4) + 3 - j] = items[i][j]
                } else {
                    Data[(i * 4) + j] = items[i][j]
                }
            } else {
                if (hasToReverse) {
                    Data[i + (4 * (3 - j))] = items[i][j]
                } else {

                    Data[i + (4 * j)] = items[i][j]
                }
            }
        }
    }
    toAdd = (DataToString !== Data.join())
    if (toAdd) {
        addOne()
    } else {
        isFailing()
    }
    repaint()
    if (isSuccessful) {
        alert('恭喜，挑战成功')
        init()
    }
}


document.onkeyup = function (e) {
    switch (e.keyCode) {
        case 37:
            move(true, false)
            break
        case 38:
            move(false, false)
            break
        case 39:
            move(true, true)
            break
        case 40:
            move(false, true)
            break
        default:
            break
    }
}

document.getElementById('restart').onclick = init

