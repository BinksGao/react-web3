import * as React from 'react'
import { RootComponent, BaseProps } from '@components/index'
import './index.less'
import { Button, Col, Form, Input, Row } from 'antd'
const { Item } = Form
interface HomeContentProps extends BaseProps {
}
interface HomeContentState {
}
export default class HomeContent extends RootComponent<HomeContentProps, HomeContentState> {
  private layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 16 }
  }
  private formRef: any = null
  constructor (props: HomeContentProps) {
    super(props)
    this.state = {
    }
  }
  // 点击链接钱包
  connectWalletHandler = () => {
  }
  render () {
    return (
      <div className='home-content'>
        <div className="content-warper">
          <div className="rule-content">
            <h1 className='main-rule'>游戏规则：合约将根据您所预言的信息与您的交易被确认的区块信息产生一个hash值</h1>
            <div className="sub-rule">
              <div className="item item-one">假设hash的最后两位分别为h31与h32，那么有三种情况，如下:</div>
              <div className="item">1、h31 {'>'} h32 --- h31胜</div>
              <div className="item">2、h31 {'<'} h32 --- h32胜</div>
              <div className="item">3、h31 {'='} h32 --- 平局</div>
            </div>
          </div>

          <div className="contract-content">
            <Form
              {...this.layout}
              ref={this.formRef}
            >
              <Row gutter={24}>
                <Col span={18}>
                  <Item label="A胜" name="AValue" rules={[{ required: true, message: '请下注!' }]} labelCol={{ span: 2 }}>
                    <Input allowClear className='input-500'/>
                  </Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={18}>
                  <Item label="B胜" name="BValue" rules={[{ required: true, message: '请下注!' }]} labelCol={{ span: 2 }}>
                    <Input allowClear className='input-500'/>
                  </Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={18}>
                  <Item label="平局" name="Equal" rules={[{ required: true, message: '请下注!' }]} labelCol={{ span: 2 }}>
                    <Input allowClear className='input-500'/>
                  </Item>
                </Col>
              </Row>
              <Row gutter={24} justify='center'>
                <Col span={18}>
                  <Item>
                    <Button type="primary" htmlType="submit">
                        买定离手
                    </Button>
                  </Item>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}
