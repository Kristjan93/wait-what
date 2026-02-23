import { Box, Button, FormField, Spinner, TextInput } from 'grommet'
import { Lock, Send } from 'grommet-icons'
import React from 'react'
import { SubmitHandler, useForm } from "react-hook-form"
import { __api__ } from '../constants/endpoint'
import { ResponseLogin } from '../types/responses'
import { errorsToString } from '../utils/forms'

interface IFormData {
  password: string
}

export const AdminLogin: React.FC = () => {
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<IFormData>()

  const onSubmit: SubmitHandler<IFormData> = async ({ password }) => {
    const response = await fetch(`${__api__}/admin/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    })

    if(response.ok) {
      const { token } = await response.json() as ResponseLogin
      localStorage.setItem('token', token)
      window.location.href = '/'
    }
    if(response.status === 400) {
      setError("password", { type: "invalid" })
    }
  }

  return (
    <Box
      pad="medium"
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      animation={['fadeIn', 'slideUp']}
      width="large"
      background="white"
      elevation="medium"
      justify='center'
      align='center'
      gap="medium"
      style={{ position: 'relative' }}
    >
      {isSubmitting && (
        <Box
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
          background="rgba(0,0,0,0.2)"
          align="center"
          justify="center"
          animation="fadeIn"
        >
          <Spinner size="large" />
        </Box>
      )}

        <FormField
          label="Password"
          fill="horizontal"
          error={errorsToString([
              errors.password?.type === 'required' && 'required',
              errors.password?.type === 'invalid' && 'invalid password'
            ])
          }
        >
          <TextInput
            {...register("password", { required: true })}
            icon={<Lock />}
            type="password"
            placeholder="password"
          />
        </FormField>

        <Box
          direction="row"
          fill="horizontal"
          justify="end"
        >
          <Button
            icon={<Send />}
            primary
            label="Submit"
            type="submit"
            size="small"
            disabled={isSubmitting}
          />
        </Box>
    </Box>
  )
}
