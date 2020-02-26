import React,{Suspense} from "react";
import PropTypes from 'prop-types'
import "./component.scss"
import LeftIcon from "./chevron-left-solid.svg"
import RightIcon from "./chevron-right-solid.svg"
import Dropdown from 'se-react-dropdown'
import { useTranslation, withTranslation } from "react-i18next";
import './i18n'

class Component0 extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            pageNo:1 //props.pagination.pageNo
        };

        if (props.defaultLanguage){
            const {t, i18n}=this.props
            i18n.changeLanguage(props.defaultLanguage.replace('-','_'));
        }
    }

    resetPage() {
        this.setState({pageNo:1 })
    }

    firePageChange(){
        const {onPageChange} = this.props
        onPageChange && onPageChange(this.state.pageNo)
    }

    goPrevPage(e){
        if (e.currentTarget.classList.contains('disabled')) return
        this.setState((s,p)=>{
            let pageNo = s.pageNo - 1
            return {
                pageNo
            }
        },this.firePageChange)
    }

    goNextPage(e){
        if (e.currentTarget.classList.contains('disabled')) return
        this.setState((s,p)=>{
            let pageNo = s.pageNo + 1
            return {
                pageNo
            }
        },this.firePageChange)
    }

    switchPage(item){
        this.setState({pageNo:item.value}, this.firePageChange)
    }

    generatePagination(){
        const {pageNo} = this.state;
        const {pageSize, rowsCount} = this.props.pagination
        let pageCount = Math.ceil(rowsCount / pageSize)
        let pages = [...Array(pageCount).keys()].splice(1);
        pages = [...pages, pageCount || 1]
        pages = pages.map(p=>({value:p}))
        const { t } = this.props;

        return (<div className="pagination">
                    <LeftIcon onClick={this.goPrevPage.bind(this)} className={"prev-page"+ (pageNo<=1 ? " disabled" : '')}/>
                    <span>{t('Page')}</span>
                    <Dropdown data={pages} value={pageNo} onChange={this.switchPage.bind(this)}/>
                    <span>{t('of')} {pageCount}</span>
                    <RightIcon onClick={this.goNextPage.bind(this)}
                               className={'next-page' + (pageNo>pageCount-1 ? ' disabled' : '')}/>
                </div>)
    }

    getHeader(){
        const {groups=[], fields} = this.props;
        const enableGroup = groups.length>0;
        const normalTh=(item)=>{
            const {name,fieldName}=item
            return <th key={name+'-'+fieldName} className={'field-'+fieldName}>{name}</th>
        }
        return (
            <thead>
                <tr>
                    {!enableGroup && fields.map(normalTh)}
                    {enableGroup && fields.map(item => {
                        const {name, fieldName} = item;
                        const isGroup = !groups.some(p=>p.fieldNames.includes(fieldName))
                        if (isGroup){
                            const rowspan = isGroup ? {rowSpan:2}:{}
                            return <th key={name+'-'+fieldName} className={'field-'+fieldName} {...rowspan}>{name}</th>
                        }else {
                            const group = groups.find(p=>p.fieldNames.includes(item.fieldName))
                            const {name:groupName, fieldNames}=group
                            if (group && fieldNames[0] == item.fieldName) {
                                return <th key={name+'-'+fieldName} className={'field-'+fieldNames.join('-')} colSpan={fieldNames.length}>{groupName}</th>
                            }
                        }

                    })}
                </tr>
                {enableGroup && <tr>
                    {fields.filter(p=>groups.some(q=>q.fieldNames.includes(p.fieldName))).map(({name,fieldName})=>(
                        <td key={`${name}-${fieldName}`}>{name}</td>
                    ))}
                </tr>}
            </thead>
        )
    }

    render() {
        const {totalData, groups=[], fields, data, pagination} = this.props;
        return (
            <div className={'se-react-data-list ' + (this.props.className || '')}>
                <div className="table-wrapper">
                    <table>
                        {this.getHeader()}
                        <tbody>
                        {
                            (data.length <= 0)? (<tr><td className="cell-notification" colSpan={fields.length}>nothing</td></tr>) :
                            data.map((row,index) => {
                                const id = row[this.props.keyField || 'id'];
                                return (
                                    <tr key={id+'-'+index}>
                                        {fields.map(item=>{
                                            let cellValue = ''
                                            const DEFAULT_SIGN = '—'
                                            const {name, fieldName} = item;
                                            const isIncludeFieldName = Object.keys(row).includes(fieldName)
                                            if (typeof(item.render)=='function'){
                                                    cellValue = item.render(row[fieldName])
                                            }else{
                                                if (isIncludeFieldName){
                                                    cellValue = row[fieldName]
                                                    cellValue = (cellValue === null || cellValue === '') ? DEFAULT_SIGN : cellValue.toString()
                                                }else{
                                                    cellValue = DEFAULT_SIGN
                                                }
                                            }
                                            return (<td key={name + '-' + fieldName} className={'field-'+fieldName}>
                                                {cellValue || ''}
                                            </td>)
                                        })}
                                    </tr>
                                )
                            }
                        )}
                        </tbody>
                        <tfoot>
                        <tr>
                            {fields.filter(p=>p!=null).map(item => {
                                const {name,fieldName} = item;
                                return <th key={name+'-'+fieldName}>{totalData[fieldName] || ''}</th>
                            })}
                        </tr>
                        </tfoot>
                    </table>
                </div>
                {this.props.enableRowsCount && (<div className="total-rows">Total:{pagination['rowsCount']} rows</div>)}
                {this.generatePagination()}
            </div>
        );
    }
}

const Component = withTranslation(undefined, { withRef: true })(Component0)
export default Component;

Component.propTypes = {
    enableRowsCount:PropTypes.bool,
    defaultLanguage:PropTypes.string,
    keyField:PropTypes.string,
    fields:PropTypes.arrayOf(PropTypes.exact({
        fieldName:PropTypes.string,
        name:PropTypes.string,
        render:PropTypes.func
    })),
    pagination:PropTypes.exact({
        pageSize: PropTypes.number,
        rowsCount: PropTypes.number
    }),
    data:PropTypes.array,
    totalData: PropTypes.object,
    rowsCount: PropTypes.number,
    onPageChange:PropTypes.func,
}
