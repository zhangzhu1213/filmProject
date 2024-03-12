import React, { useState, useContext, useEffect } from 'react'
import Header from '../../components/Header'
import { Modal, Input, message } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { context } from '../../hooks/store'
import useUser from '../../hooks/useUser'
// import ImgCrop from 'antd-img-crop'
// import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import classNames from 'classnames'
import styles from './styles.module.scss'

export default function AccountManagement() {
  const navigate = useNavigate()
  const {userInfo} = useContext(context)
  const { userError, userInfoUpdate } = useUser()
  const [messageApi, contextHolder] = message.useMessage()
  const [newNickname, setNewNickname] = useState('')
  const [newPosition, setNewPosition] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false)

  useEffect(() => {
    if (userError !== '') {
      return error(userError)
    }
  }, [userError])

  useEffect(() => {
    if (userInfo._id === '') {
      error('用户未登录，请先登录')
      navigate('/login')
    }
  }, [])
  const error = (value: string) => {
    message.open({
      type: 'error',
      content: `${value}`,
      duration: 1,
    })
  }
  const success = (value: string) => {
    message.open({
      type: 'success',
      content: `${value}`,
      duration: 1,
    })
  }
  const nicknameOk = async () => {
    if (newNickname === '') {
      return error('昵称不能为空！')
    } else if (newNickname === userInfo.nickname) {
      return error('新昵称与原昵称相同！')
    } else {
      console.log('昵称修改成果！', newNickname)
      await userInfoUpdate({isUpdatePassword: false, nickname: newNickname})
    }
    setNewNickname('')
    setIsNicknameModalOpen(false)
  }
  const nicknameCancel = () => {
    setNewNickname('')
    setIsNicknameModalOpen(false)
  }
  const positionOk = async () => {
    if (newPosition === '') {
      return error('居住地不可以为空！')
    } else if (userInfo.basePosition === newPosition) {
      return error('常居地未发生变化！')
    } {
      console.log('修改居住地', newPosition)
      await userInfoUpdate({isUpdatePassword:  false, basePosition: newPosition})
    }
    setNewPosition('')
    setIsPositionModalOpen(false)
  }
  const positionCancel = () => {
    setNewPosition('')
    setIsPositionModalOpen(false)
  }
  const passwordOk = async () => {
    const regExpPassword = /^[a-zA-Z][a-zA-Z0-9_]{5,11}$/
    if (oldPassword === '' || newPassword === '' || confirmPassword === '') {
      return error('密码内容不能为空！')
    } else if (!regExpPassword.test(oldPassword)) {
      return error('旧密码格式有误！(字母开头，6~12位字母、数字、下划线)')
    } else if (!regExpPassword.test(newPassword)) {
      return error('新密码格式有误！(字母开头，6~12位字母、数字、下划线)')
    } else if (newPassword !== confirmPassword) {
      return error('确认新密码与新密码内容不一致！')
    } else if (oldPassword === newPassword) {
      return error('新旧密码一致！')
    } else {
      console.log('密码：', oldPassword, newPassword, confirmPassword)
      await userInfoUpdate({isUpdatePassword: true, oldPassword, newPassword})
    }
    setIsPasswordModalOpen(false)
  }
  const passwordCancel = () => {
    setIsPasswordModalOpen(false)
  }
  return (
    <>
      {/* {contextHolder} */}
      <div className={styles.account_setting_container}>
        <Header userInfo={userInfo} isHeaderContent={false} />
        <div className={styles.content}>
          <div className={styles.banner}>好看电影，让你我看世界！</div>
          <div className={styles.setting}>
            {/* <div className={styles.avatar}>
              <span>头像:</span>
              
            </div> */}
            <div className={styles.account}>
              <span>账号:</span>
              <span>{ userInfo.account }</span>
            </div>
            <div className={styles.nickname}>
              <span>昵称:</span>
              <span>{  userInfo.nickname }</span>
              <span
                className={styles.nickname_update}
                onClick={() => {
                  setIsNicknameModalOpen(true)
                }}
              >
                修改昵称
              </span>
            </div>
            <div className={styles.password}>
              <span>密码:</span>
              <span
                className={styles.password_update}
                onClick={() => {
                  setIsPasswordModalOpen(true)
                }}
              >
                修改密码
              </span>
            </div>
            <div className={styles.base}>
              <span>常居地:</span>
              {
                userInfo.basePosition === '' ? '' : <span>{userInfo.basePosition}</span> 
              }
              <span
                className={styles.base_update}
                onClick={() => {
                  setIsPositionModalOpen(true)
                }}
              >
                {
                  userInfo.basePosition === '' ? '添加常居地' : '修改常居地'
                }
              </span>
            </div>
          </div>
        </div>
        <Modal
          title="修改昵称"
          open={isNicknameModalOpen}
          onOk={nicknameOk}
          onCancel={nicknameCancel}
        >
          <Input
            type="text"
            value={newNickname}
            placeholder="请输入新昵称"
            onChange={(e) => {
              setNewNickname(e.target.value.trim())
            }}
          />
        </Modal>
        <Modal
          title="修改密码"
          open={isPasswordModalOpen}
          onOk={passwordOk}
          onCancel={passwordCancel}
        >
          <div
            style={{
              display: 'flex',
              gap: '39px',
              alignItems: 'center',
              marginBottom: '15px',
            }}
          >
            <span>旧密码:</span>
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              value={oldPassword}
              placeholder="请输入旧密码"
              style={{ flex: '1' }}
              onChange={(e) => {
                setOldPassword(e.target.value.trim())
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              gap: '39px',
              alignItems: 'center',
              marginBottom: '15px',
            }}
          >
            <span>新密码:</span>
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              value={newPassword}
              placeholder="请输入新密码(字母开头，6~12数字、字母、下划线)"
              style={{ flex: '1' }}
              onChange={(e) => {
                setNewPassword(e.target.value.trim())
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              marginBottom: '15px',
            }}
          >
            <span>确认新密码:</span>
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              value={confirmPassword}
              placeholder="确认新密码"
              style={{ flex: '1' }}
              onChange={(e) => {
                setConfirmPassword(e.target.value.trim())
              }}
            />
          </div>
        </Modal>
        <Modal
          title="修改常居地"
          open={isPositionModalOpen}
          onOk={positionOk}
          onCancel={positionCancel}
        >
          <Input
            type="text"
            value={newPosition}
            placeholder="请输入新昵称"
            onChange={(e) => {
              setNewPosition(e.target.value.trim())
            }}
          />
        </Modal>
      </div>
    </>
  )
}
