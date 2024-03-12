import { useEffect } from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form, Input, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import useUser from '../../hooks/useUser'
import styles from '../Login/style.module.scss'
export default function Register() {
  const navigate = useNavigate()
  const { userRegister, userError } = useUser()

  useEffect(() => {
    if (userError !== '') {
      return error(userError)
    }
  }, [userError])
  const error = (value: string) => {
    message.open({
      type: 'error',
      content: `${value}`,
    })
  }

  const onFinish = (values: any) => {
    if (values.password !== values.confirmPassword)
      return error('确认密码错误！')
    userRegister(values.account, values.password)
  }
  return (
    <>
      <div className={styles.login}>
        <header>
          <div className={styles.banner}>好看电影，让你我看世界</div>
          <Button
            type="primary"
            style={{ marginRight: '20px' }}
            onClick={() => navigate('/')}
          >
            回到首页
          </Button>
        </header>
        <div className={styles.login_body}>
          <div className={styles.login_body_left}></div>
          <div className={styles.login_body_right}>
            <div className={styles.right_header}>
              <span className={styles.header_left}>注</span>
              <span className={styles.header_middle}></span>
              <span className={styles.header_right}>册</span>
            </div>
            <div className={styles.right_content}>
              <div className={styles.content_main}>
                <Form
                  name="normal_login"
                  className="login-form"
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                >
                  <Form.Item
                    name="account"
                    rules={[
                      {
                        required: true,
                        type: 'string',
                        message: '请输入手机号/邮箱!',
                      },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined className="site-form-item-icon" />}
                      placeholder="手机号/邮箱"
                    />
                  </Form.Item>
                  <Form.Item
                    name="confirmPassword"
                    rules={[
                      {
                        required: true,
                        type: 'string',
                        message: '请输入密码!',
                      },
                      {
                        type: 'string',
                        min: 6,
                        max: 12,
                        pattern: /^[a-zA-Z][a-zA-Z0-9_]{5,11}$/,
                        message: '密码格式不正确!',
                      },
                    ]}
                  >
                    <Input
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      type="password"
                      placeholder="字母开头,6~12位字母、数字、下划线"
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        type: 'string',
                        message: '请输入确认密码!',
                      },
                      {
                        type: 'string',
                        min: 6,
                        max: 12,
                        pattern: /^[a-zA-Z][a-zA-Z0-9_]{6,12}$/,
                        message: '密码格式不正确!',
                      },
                    ]}
                  >
                    <Input
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      type="password"
                      placeholder="请输入确认密码"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="login-form-button"
                    >
                      注册
                    </Button>
                  </Form.Item>
                </Form>
              </div>
              <div className={styles.content_register}>
                已注册？请
                <span
                  className={styles.to_register}
                  onClick={() => {
                    navigate('/login')
                  }}
                >
                  登录
                </span>
                !
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
