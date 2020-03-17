import React from "react";
import {render} from "react-dom";
import Component from "./component";
import './index.scss'
import $ from "jquery";

const styles = {
    fontFamily: "sans-serif",
};

const numRender={
    render:v=>`--${v}--`
}

const extraProps = {
    cellRender: v=>{
        if ((v.startsWith('Yes') || v.startsWith('No')) && v.includes(':')){
            const arr = v.split(':')
            return `${arr[0]=='Yes'?'Correct':'Wrong'} ${arr[1]}%` //
        }else{
            return v
        }
    }
}

let fields = [
    {name: 'Name', fieldName: 'Name'},
    {name: 'City', fieldName: 'City'},
    {name: 'Email', fieldName: 'Email'},
]



class BaseReport extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            data: [],
            totalData: {},
            rowsCount: 0
        }
    }
}

class App extends BaseReport {
    constructor(props, context) {
        super(props, context);

        //fetch data then place data and rowsCount into state
        this.state = {
            ...this.state,
        }

        this.myRef = React.createRef();
        this.fetchData(1)
    }

    loadData() {
        this.fetchData(1)
        this.myRef.current.resetPage()
    }


    fetchData(pageNo) {
        let data = {a1: '11', a2: '22'}
        let parametersStr = Object.keys(data).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`).join('&')

        //const url = `real_data.json`
        const url = 'course_report_time_spent.json'
        let toolbarData = {
            selectedFilterItems: [
                {text: "Address", value: "De street"},
                {text: "Country", value: "France"},
            ],
            selectedProperties: [
                {text: "Address", value: "user__profile__lt_address", checked: true},
                {text: "City", value: "user__profile__city", checked: true}
            ],
            startDate: "2020-02-05",
            endDate: "2020-02-07",
            exportType: "xls"
        }
        let ajaxData = {
            'report_type': 'learner_report',
            'courses_selected': [''],
            'query_tuples': toolbarData.selectedFilterItems.map(p => [p.text, p.value]),
            'selected_properties': toolbarData.selectedProperties.map(p => p.value),
            'from_day': toolbarData.startDate,
            'to_day': toolbarData.endDate,
            'format': toolbarData.exportType,
            'csrfmiddlewaretoken': 'nDou5pR169v76UwtX4XOpbQsSTLu6SexeWyd0ykjGR2ahYMV0OY7nddkYQqnT6ze',
            'page': {
                no: pageNo, size: 10
            },
        }

        $.ajax(url, {
            method:'get',
            dataType: 'json',
            data: ajaxData,
            success:(json) => {
                this.setState((s, p) => {
                    return {
                        data: json.list,
                        totalData: json.total, //{email: 'total:', first_name: json.total},
                        rowsCount: json.pagination.rowsCount
                    }
                })
            }
        })

    }

    getDynamicFields(){
        const {data} = this.state
        const propertiesValues = fields.map(f=>f.fieldName)

        let dynamicFields = [], subFields = []
        if (data && data.length > 0){
            const firstRow = data[0]
            const dynamicKeys = Object.keys(firstRow)
                .filter(key=>{
                    return !propertiesValues.includes(key) // && !key.split('/')[1]
                })
            const complexDynamicKeys = dynamicKeys.filter(key=>key.split('/')[1])
            const complexDynamicKeysL1 = complexDynamicKeys.map(key=>key.split('/')[0])
            //const complexDynamicKeysL2 = complexDynamicKeys.map(key=>key.split('/')[1])

            const normalDynamicFields = dynamicKeys.filter(key=>!key.split('/')[1])
            const complexDynamicFields = [...new Set(complexDynamicKeys.map(key=>key.split('/')[0]))]
            const countSpan = (key)=>{
                return complexDynamicKeysL1.filter(l1key=>key==l1key).length
            }

            dynamicFields = [...normalDynamicFields.map(key=>({name:key,fieldName:key})),
                ...complexDynamicFields.map(key=>({name:key,fieldName:key, colSpan:countSpan(key)}))]
            subFields = complexDynamicKeys.map(key=>{
                const arr = key.split('/')
                const keyL2 = arr[1]
                return {name:keyL2,fieldName:key}
            })
        }
        return {dynamicFields, subFields}
    }

    getConfig(){
        const {dynamicFields, subFields}=this.getDynamicFields()
        return {
            fields:fields.map(item=>({...item})).concat(dynamicFields),
            subFields,
            pagination:{
                pageSize: 2, rowsCount: Number(this.state.rowsCount)
            },
            keyField:"ID",
            defaultLanguage:"en",
            enableRowsCount:true,
            ...this.state
        }
    }

    render() {
        const config = this.getConfig()
        return (
            <div style={styles}>
                <button className="btn-load-data" onClick={this.loadData.bind(this)}>Load data</button>
                <Component ref={this.myRef}
                           {...config} {...extraProps}
                           onPageChange={this.fetchData.bind(this)}
                />
            </div>
        );
    }
}

render(<App/>, document.querySelector(".root"));

